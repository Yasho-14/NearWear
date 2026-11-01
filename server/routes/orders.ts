import { Router, Request, Response } from 'express';
import { prisma } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';
import { calculateCheckoutSummary } from '../services/calculation.ts';

export const ordersRouter = Router();

// Multi-Seller Checkout & Order Creation
ordersRouter.post('/checkout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      items, // array of { productId, variantId, quantity }
      deliveryType = 'HOME_DELIVERY', // 'HOME_DELIVERY' | 'STORE_PICKUP'
      deliveryAddress,
      customerPhone,
      customerName,
      couponCode,
      paymentMethod = 'COD' // 'COD' | 'RAZORPAY'
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (deliveryType === 'HOME_DELIVERY' && !deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address is required for home delivery' });
    }

    // 1. Fetch products & variants with live inventory and shop details
    const variantIds = items.map((i: any) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: {
          include: { shop: true }
        },
        inventory: true
      }
    });

    const variantMap = new Map(variants.map(v => [v.id, v]));

    // 2. Validate stock availability for each item
    for (const item of items) {
      const v = variantMap.get(item.variantId);
      if (!v) {
        return res.status(400).json({ error: `Variant ID ${item.variantId} not found` });
      }
      const available = v.inventory ? v.inventory.availableQuantity : 0;
      if (available < item.quantity) {
        return res.status(400).json({
          error: `Item "${v.product.title}" (${v.size}, ${v.color}) has only ${available} left in stock.`
        });
      }
    }

    // 3. Fetch coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true }
      });
      if (!coupon) {
        return res.status(400).json({ error: 'Invalid or expired coupon code' });
      }
    }

    // 4. Prepare calculation inputs
    const calculationItems = items.map((item: any) => {
      const v = variantMap.get(item.variantId)!;
      return {
        shopId: v.product.shop.id,
        shopName: v.product.shop.name,
        price: v.price || v.product.price,
        quantity: item.quantity,
        variantId: v.id,
        baseDeliveryFee: v.product.shop.baseDeliveryFee,
        freeDeliveryAbove: v.product.shop.freeDeliveryAbove
      };
    });

    const summary = calculateCheckoutSummary(
      calculationItems,
      deliveryType,
      coupon ? {
        code: coupon.code,
        discountType: coupon.discountType as any,
        value: coupon.value,
        minOrderVal: coupon.minOrderVal,
        maxDiscount: coupon.maxDiscount
      } : null,
      8.0 // 8% standard platform commission
    );

    // 5. Atomic transaction: create order, seller sub-orders, order items, and reserve inventory
    const orderNumber = `NW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create main Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          deliveryType,
          deliveryAddress: deliveryAddress || 'Store Pickup',
          customerName: customerName || req.user!.name,
          customerPhone: customerPhone || '9822000000',
          subtotalAmount: summary.subtotal,
          deliveryFeeTotal: summary.totalDeliveryFee,
          taxAmount: summary.taxAmount,
          discountAmount: summary.discountAmount,
          couponCode: coupon?.code || null,
          totalAmount: summary.totalPayable,
          paymentMethod,
          paymentStatus: paymentMethod === 'RAZORPAY' ? 'CAPTURED' : 'PENDING'
        }
      });

      // Group items by shop
      let subOrderIndex = 1;
      for (const split of summary.shopSplits) {
        const subOrderNumber = `${orderNumber}-S${subOrderIndex++}`;
        const sellerOrder = await tx.sellerOrder.create({
          data: {
            orderId: newOrder.id,
            shopId: split.shopId,
            subOrderNumber,
            status: 'PENDING_SELLER_CONFIRMATION',
            shopSubtotal: split.itemsTotal,
            deliveryFee: split.deliveryFee,
            platformCommission: split.commissionAmount,
            sellerPayable: split.sellerPayable
          }
        });

        // Add line items belonging to this shop & deduct available stock
        const shopItems = items.filter(i => {
          const v = variantMap.get(i.variantId)!;
          return v.product.shop.id === split.shopId;
        });

        for (const item of shopItems) {
          const v = variantMap.get(item.variantId)!;
          const unitPrice = v.price || v.product.price;
          const totalPrice = unitPrice * item.quantity;

          await tx.orderItem.create({
            data: {
              sellerOrderId: sellerOrder.id,
              productId: v.product.id,
              variantId: v.id,
              title: v.product.title,
              size: v.size,
              color: v.color,
              quantity: item.quantity,
              unitPrice,
              totalPrice,
              commissionPct: 8.0
            }
          });

          // Atomically decrement available quantity and increment reserved quantity
          if (v.inventory) {
            await tx.inventory.update({
              where: { id: v.inventory.id },
              data: {
                availableQuantity: { decrement: item.quantity },
                reservedQuantity: { increment: item.quantity }
              }
            });
          }
        }
      }

      // Record payment transaction
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: summary.totalPayable,
          currency: 'INR',
          gateway: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
          gatewayOrderId: paymentMethod === 'RAZORPAY' ? `order_rzp_${Date.now().toString(36)}` : null,
          gatewayPaymentId: paymentMethod === 'RAZORPAY' ? `pay_rzp_${Date.now().toString(36)}` : null,
          status: paymentMethod === 'RAZORPAY' ? 'CAPTURED' : 'PENDING'
        }
      });

      return newOrder;
    });

    // Return complete populated order
    const fullOrder = await prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: {
        sellerOrders: {
          include: {
            shop: { select: { id: true, name: true, area: true, phone: true } },
            items: true
          }
        },
        payments: true
      }
    });

    res.status(201).json(fullOrder);
  } catch (error: any) {
    console.error('Checkout failed:', error);
    res.status(500).json({ error: error.message || 'Checkout failed' });
  }
});

// Get customer's orders
ordersRouter.get('/customer', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        sellerOrders: {
          include: {
            shop: { select: { id: true, name: true, area: true, phone: true } },
            items: {
              include: {
                product: {
                  include: { images: true }
                }
              }
            }
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Get seller's shop orders
ordersRouter.get('/seller', authenticateToken, requireRole(['SELLER', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    let shopIds: string[] = [];

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
      include: { shops: true }
    });

    if (seller && seller.shops.length > 0) {
      shopIds = seller.shops.map(s => s.id);
    } else {
      // Find shop matching user or first available shop for admin
      const shop = await prisma.shop.findFirst();
      if (shop) shopIds = [shop.id];
    }

    if (shopIds.length === 0) {
      return res.json([]);
    }

    const sellerOrders = await prisma.sellerOrder.findMany({
      where: { shopId: { in: shopIds } },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            deliveryType: true,
            deliveryAddress: true,
            paymentMethod: true,
            paymentStatus: true,
            createdAt: true
          }
        },
        items: {
          include: {
            product: { include: { images: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(sellerOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve seller orders' });
  }
});

// Seller update sub-order status
ordersRouter.patch('/seller/:id/status', authenticateToken, requireRole(['SELLER', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;
    const allowed = [
      'ACCEPTED',
      'REJECTED',
      'PROCESSING',
      'PACKED',
      'READY_FOR_PICKUP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED'
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const sellerOrder = await prisma.sellerOrder.findUnique({
      where: { id: req.params.id },
      include: { shop: { include: { sellerProfile: true } }, items: true }
    });

    if (!sellerOrder) {
      return res.status(404).json({ error: 'Seller order not found' });
    }

    if (req.user!.role !== 'ADMIN' && sellerOrder.shop.sellerProfile.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized for this order' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // If delivered, finalize inventory deduction
      if (status === 'DELIVERED') {
        for (const itm of sellerOrder.items) {
          const inv = await tx.inventory.findUnique({ where: { variantId: itm.variantId } });
          if (inv) {
            await tx.inventory.update({
              where: { id: inv.id },
              data: {
                totalQuantity: { decrement: itm.quantity },
                reservedQuantity: { decrement: itm.quantity }
              }
            });
          }
        }
      }

      // If rejected or cancelled, release reserved stock
      if (status === 'REJECTED' || status === 'CANCELLED') {
        for (const itm of sellerOrder.items) {
          const inv = await tx.inventory.findUnique({ where: { variantId: itm.variantId } });
          if (inv) {
            await tx.inventory.update({
              where: { id: inv.id },
              data: {
                availableQuantity: { increment: itm.quantity },
                reservedQuantity: { decrement: itm.quantity }
              }
            });
          }
        }
      }

      return tx.sellerOrder.update({
        where: { id: req.params.id },
        data: {
          status,
          rejectionReason: rejectionReason || undefined,
          acceptedAt: status === 'ACCEPTED' ? new Date() : undefined,
          packedAt: status === 'PACKED' ? new Date() : undefined,
          deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
          cancelledAt: status === 'CANCELLED' ? new Date() : undefined
        }
      });
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});
