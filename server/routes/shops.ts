import { Router, Request, Response } from 'express';
import { prisma } from '../db.ts';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.ts';

export const shopsRouter = Router();

// Get all verified/approved shops with optional area & category filters
shopsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { area, category, search, pincode, isFeatured } = req.query;

    const where: any = {
      status: 'APPROVED'
    };

    if (area && area !== 'All Kolhapur' && area !== 'All') {
      where.area = { contains: String(area) };
    }

    if (pincode) {
      where.pincode = String(pincode);
    }

    if (category && category !== 'All') {
      where.category = { contains: String(category) };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { area: { contains: q } },
        { category: { contains: q } }
      ];
    }

    const shops = await prisma.shop.findMany({
      where,
      include: {
        _count: {
          select: { products: true, reviews: true }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' }
      ]
    });

    res.json(shops);
  } catch (error: any) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

// Get shop details with products and reviews
shopsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const shop = await prisma.shop.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { slug: req.params.id }
        ]
      },
      include: {
        products: {
          where: { isAvailable: true },
          include: {
            images: true,
            variants: {
              include: { inventory: true }
            },
            category: true
          }
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shop details' });
  }
});

// Seller create or update shop profile
shopsRouter.patch('/:id', authenticateToken, requireRole(['SELLER', 'ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: req.params.id },
      include: { sellerProfile: true }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (req.user!.role !== 'ADMIN' && shop.sellerProfile.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to edit this shop' });
    }

    const {
      name, description, category, phone, streetAddress, area, pincode,
      openingHours, baseDeliveryFee, freeDeliveryAbove, allowsStorePickup,
      allowsHomeDelivery, bannerUrl, logoUrl
    } = req.body;

    const updated = await prisma.shop.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        category,
        phone,
        streetAddress,
        area,
        pincode,
        openingHours,
        baseDeliveryFee: baseDeliveryFee !== undefined ? Number(baseDeliveryFee) : undefined,
        freeDeliveryAbove: freeDeliveryAbove !== undefined ? Number(freeDeliveryAbove) : undefined,
        allowsStorePickup: allowsStorePickup !== undefined ? Boolean(allowsStorePickup) : undefined,
        allowsHomeDelivery: allowsHomeDelivery !== undefined ? Boolean(allowsHomeDelivery) : undefined,
        bannerUrl,
        logoUrl
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update shop' });
  }
});
