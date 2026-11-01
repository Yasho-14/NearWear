import { Router, Request, Response } from 'express';
import { prisma } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

export const productsRouter = Router();

// Browse products with multi-faceted search & filters
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      gender,
      minPrice,
      maxPrice,
      area,
      shopId,
      isFeatured,
      sort
    } = req.query;

    const where: any = {
      isAvailable: true,
      shop: {
        status: 'APPROVED'
      }
    };

    if (shopId) {
      where.shopId = String(shopId);
    }

    if (area && area !== 'All Kolhapur' && area !== 'All') {
      where.shop.area = { contains: String(area) };
    }

    if (gender && gender !== 'ALL') {
      where.OR = [
        { gender: String(gender) },
        { gender: 'UNISEX' }
      ];
    }

    if (category && category !== 'All') {
      where.category = {
        name: { contains: String(category) }
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { brand: { contains: q } },
        { shop: { name: { contains: q } } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { isFeatured: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        variants: {
          include: { inventory: true }
        },
        category: true,
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            area: true,
            rating: true,
            baseDeliveryFee: true,
            freeDeliveryAbove: true,
            allowsStorePickup: true,
            allowsHomeDelivery: true
          }
        }
      },
      orderBy
    });

    res.json(products);
  } catch (error: any) {
    console.error('Failed to query products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Single product details
productsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        variants: {
          include: { inventory: true }
        },
        category: true,
        shop: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Categories list
productsRouter.get('/meta/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { products: true } }
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// Seller create product
productsRouter.post('/', authenticateToken, requireRole(['SELLER', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const {
      shopId,
      title,
      description,
      categoryId,
      gender = 'UNISEX',
      price,
      mrp,
      fabric,
      brand,
      images = [],
      variants = []
    } = req.body;

    if (!shopId || !title || !price) {
      return res.status(400).json({ error: 'shopId, title, and price are required' });
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { sellerProfile: true }
    });

    if (!shop || (req.user!.role !== 'ADMIN' && shop.sellerProfile.userId !== req.user!.id)) {
      return res.status(403).json({ error: 'Not authorized for this shop' });
    }

    const calculatedDiscount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        shopId,
        title,
        slug,
        description: description || 'Local boutique garment.',
        categoryId: categoryId || undefined,
        gender,
        price: Number(price),
        mrp: mrp ? Number(mrp) : Number(price),
        discountPct: calculatedDiscount,
        fabric,
        brand,
        images: {
          create: images.map((img: { url: string; altText?: string }, idx: number) => ({
            url: img.url,
            altText: img.altText || title,
            isPrimary: idx === 0
          }))
        },
        variants: {
          create: variants.map((v: { size: string; color: string; colorHex?: string; stock?: number; price?: number }, idx: number) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || '#111827',
            sku: `${shop.slug.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-${idx}`,
            price: v.price ? Number(v.price) : undefined,
            inventory: {
              create: {
                totalQuantity: v.stock !== undefined ? Number(v.stock) : 10,
                availableQuantity: v.stock !== undefined ? Number(v.stock) : 10,
                reservedQuantity: 0
              }
            }
          }))
        }
      },
      include: {
        images: true,
        variants: { include: { inventory: true } }
      }
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});
