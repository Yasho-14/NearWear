import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.ts';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.ts';

export const authRouter = Router();

// Register new user (Customer or Seller)
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role = 'CUSTOMER', businessName, area } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = ['CUSTOMER', 'SELLER'].includes(role) ? role : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role: assignedRole,
        customerProfile: assignedRole === 'CUSTOMER' ? {
          create: { preferredArea: area || 'Rajarampuri, Kolhapur' }
        } : undefined,
        sellerProfile: assignedRole === 'SELLER' ? {
          create: {
            businessType: 'Sole Proprietorship',
            shops: {
              create: {
                name: businessName || `${name}'s Fashion Studio`,
                slug: `${(businessName || name).toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
                description: 'Quality local apparel boutique in Kolhapur.',
                category: 'Modern Casuals & Ethnic',
                logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop&q=80',
                bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
                phone: phone || '+91 98220 00000',
                email: email,
                streetAddress: 'Main Market Road',
                area: area || 'Rajarampuri',
                city: 'Kolhapur',
                state: 'Maharashtra',
                pincode: '416008',
                status: 'APPROVED' // Auto-approved for fast seamless demo
              }
            }
          }
        } : undefined
      },
      include: {
        customerProfile: true,
        sellerProfile: { include: { shops: true } }
      }
    });

    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        sellerProfile: user.sellerProfile
      },
      token
    });
  } catch (error: any) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: error.message || 'Failed to register account' });
  }
});

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        customerProfile: true,
        sellerProfile: { include: { shops: true } }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        customerProfile: user.customerProfile,
        sellerProfile: user.sellerProfile
      },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Current User Profile
authRouter.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        customerProfile: true,
        sellerProfile: { include: { shops: true } },
        addresses: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      customerProfile: user.customerProfile,
      sellerProfile: user.sellerProfile,
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// 1-Click Demo Switcher - Allows instant frictionless switching between Customer, Seller, and Admin
authRouter.post('/switch-demo', async (req: Request, res: Response) => {
  try {
    const { targetRole } = req.body; // 'CUSTOMER' | 'SELLER' | 'ADMIN'
    let targetEmail = 'customer@nearwear.demo';
    if (targetRole === 'SELLER') targetEmail = 'seller@nearwear.demo';
    if (targetRole === 'ADMIN') targetEmail = 'admin@nearwear.demo';

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        customerProfile: true,
        sellerProfile: { include: { shops: true } },
        addresses: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Demo user not found. Please run database seed.' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        customerProfile: user.customerProfile,
        sellerProfile: user.sellerProfile,
        addresses: user.addresses
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to switch demo account' });
  }
});
