import { Router, Request, Response } from 'express';
import { prisma } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

export const adminRouter = Router();

// Platform Overview metrics
adminRouter.get('/overview', authenticateToken, requireRole(['ADMIN']), async (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalSellers = await prisma.user.count({ where: { role: 'SELLER' } });
    const totalShops = await prisma.shop.count();
    const approvedShops = await prisma.shop.count({ where: { status: 'APPROVED' } });
    const pendingShops = await prisma.shop.count({ where: { status: 'PENDING' } });
    const totalProducts = await prisma.product.count();

    const orders = await prisma.order.findMany({
      include: { sellerOrders: true }
    });

    const gmv = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const platformCommissionEarned = orders.reduce((acc, o) => {
      const comm = o.sellerOrders.reduce((sAcc, so) => sAcc + so.platformCommission, 0);
      return acc + comm;
    }, 0);

    const recentShops = await prisma.shop.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        sellerProfile: { include: { user: { select: { name: true, email: true, phone: true } } } }
      }
    });

    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        sellerOrders: { include: { shop: { select: { name: true } } } }
      }
    });

    res.json({
      metrics: {
        totalUsers,
        totalSellers,
        totalShops,
        approvedShops,
        pendingShops,
        totalProducts,
        totalOrders: orders.length,
        gmv: Math.round(gmv * 100) / 100,
        platformCommissionEarned: Math.round(platformCommissionEarned * 100) / 100
      },
      recentShops,
      recentOrders
    });
  } catch (error: any) {
    console.error('Admin overview failed:', error);
    res.status(500).json({ error: 'Failed to retrieve admin analytics' });
  }
});

// Update shop status (APPROVED, REJECTED, SUSPENDED)
adminRouter.patch('/shops/:id/status', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;
    const allowed = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const shop = await prisma.shop.update({
      where: { id: req.params.id },
      data: {
        status,
        rejectionReason: rejectionReason || null
      }
    });

    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shop status' });
  }
});

// Get & create commission rules
adminRouter.get('/commission-rules', authenticateToken, requireRole(['ADMIN']), async (_req: AuthRequest, res: Response) => {
  try {
    const rules = await prisma.commissionRule.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

adminRouter.post('/commission-rules', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, ratePercent, minFee = 10, scope = 'DEFAULT' } = req.body;
    const rule = await prisma.commissionRule.create({
      data: {
        name,
        ratePercent: Number(ratePercent),
        minFee: Number(minFee),
        scope
      }
    });
    res.status(201).json(rule);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create commission rule' });
  }
});
