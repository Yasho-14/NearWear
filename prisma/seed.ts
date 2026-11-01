import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive NearWear 50+ fashion product seeding...');

  // Cascade cleanup in proper dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.sellerOrder.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.commissionRule.deleteMany();
  await prisma.user.deleteMany();

  const defaultHash = await bcrypt.hash('password123', 10);

  // 1. Users & Profiles (both official demo accounts and Kolhapur persona accounts)
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@nearwear.demo',
      passwordHash: defaultHash,
      name: 'Aarav Deshmukh',
      phone: '+91 98220 12345',
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      customerProfile: {
        create: {
          preferredArea: 'Rajarampuri, Kolhapur',
          savedMeasurements: JSON.stringify({ chest: '38 in', waist: '32 in', shoeSize: 'UK 8' })
        }
      },
      addresses: {
        create: {
          title: 'Home',
          name: 'Aarav Deshmukh',
          phone: '+91 98220 12345',
          street: 'Flat 302, Sai Heritage, 4th Lane',
          area: 'Rajarampuri',
          city: 'Kolhapur',
          state: 'Maharashtra',
          pincode: '416008',
          isDefault: true
        }
      }
    }
  });

  // Secondary customer alias
  await prisma.user.create({
    data: {
      email: 'aarav@nearwear.in',
      passwordHash: defaultHash,
      name: 'Aarav Deshmukh',
      phone: '+91 98220 12345',
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  });

  const sellerUser1 = await prisma.user.create({
    data: {
      email: 'seller@nearwear.demo',
      passwordHash: defaultHash,
      name: 'Sagar Patil',
      phone: '+91 94220 54321',
      role: 'SELLER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      sellerProfile: {
        create: {
          businessType: 'Partnership',
          panNumber: 'AAACP1234F',
          gstin: '27AAACP1234F1Z5',
          bankAccountName: 'Sagar Ethnic & Handlooms',
          bankAccountNumber: '912010045678912',
          bankIfscCode: 'MAHB0000123'
        }
      }
    },
    include: { sellerProfile: true }
  });

  // Secondary seller alias
  await prisma.user.create({
    data: {
      email: 'sagar@sagarsilk.com',
      passwordHash: defaultHash,
      name: 'Sagar Patil',
      phone: '+91 94220 54321',
      role: 'SELLER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    }
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      email: 'rohit@royalchappals.com',
      passwordHash: defaultHash,
      name: 'Rohit Kadam',
      phone: '+91 98233 87654',
      role: 'SELLER',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      sellerProfile: {
        create: {
          businessType: 'Artisan Sole Proprietorship',
          panNumber: 'ABCPK5678R',
          gstin: '27ABCPK5678R1Z2',
          bankAccountName: 'Royal Kolhapuri Leather Crafts',
          bankAccountNumber: '032101000987654',
          bankIfscCode: 'SBIN0000412'
        }
      }
    },
    include: { sellerProfile: true }
  });

  const sellerUser3 = await prisma.user.create({
    data: {
      email: 'vikram@shahupuritrendz.com',
      passwordHash: defaultHash,
      name: 'Vikram Shinde',
      phone: '+91 98211 44332',
      role: 'SELLER',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      sellerProfile: {
        create: {
          businessType: 'Private Limited',
          panNumber: 'AAGCV9876T',
          gstin: '27AAGCV9876T1Z8',
          bankAccountName: 'Shahupuri Denim & Modern Wear',
          bankAccountNumber: '50100234567891',
          bankIfscCode: 'HDFC0000182'
        }
      }
    },
    include: { sellerProfile: true }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@nearwear.demo',
      passwordHash: defaultHash,
      name: 'Pooja Kulkarni',
      phone: '+91 99221 00001',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
    }
  });

  // Admin alias
  await prisma.user.create({
    data: {
      email: 'admin@nearwear.in',
      passwordHash: defaultHash,
      name: 'Pooja Kulkarni',
      phone: '+91 99221 00001',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
    }
  });

  console.log('✅ Created users and test accounts');

  // 2. Categories
  const catMens = await prisma.category.create({
    data: {
      name: "Men's Wear",
      slug: 'mens-wear',
      description: 'Shirts, casual t-shirts, jeans, trousers, and festive kurtas',
      imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
      gender: 'MEN',
      orderIndex: 1
    }
  });

  const catWomens = await prisma.category.create({
    data: {
      name: "Women's Wear",
      slug: 'womens-wear',
      description: 'Kurtis, sarees, anarkalis, dresses, tops, and festive co-ords',
      imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
      gender: 'WOMEN',
      orderIndex: 2
    }
  });

  const catKids = await prisma.category.create({
    data: {
      name: "Kids' Wear",
      slug: 'kids-wear',
      description: 'Boys shirts, girls frocks, festive kurtas, and comfortable daily sets',
      imageUrl: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&auto=format&fit=crop&q=80',
      gender: 'KIDS',
      orderIndex: 3
    }
  });

  const catFootwear = await prisma.category.create({
    data: {
      name: 'Footwear & Chappals',
      slug: 'footwear-chappals',
      description: 'Authentic handcrafted Kolhapuri leather chappals, mojris, and sandals',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
      gender: 'ALL',
      orderIndex: 4
    }
  });

  const catEthnic = await prisma.category.create({
    data: {
      name: 'Ethnic & Sarees',
      slug: 'ethnic-sarees',
      description: 'Traditional Kolhapuri Paithani, Nauvari, Banarasi silk, and wedding drapes',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      gender: 'WOMEN',
      orderIndex: 5
    }
  });

  const catDenim = await prisma.category.create({
    data: {
      name: 'Denim & Streetwear',
      slug: 'denim-streetwear',
      description: 'Stretch jeans, cargo pants, oversized tees, and jackets',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
      gender: 'UNISEX',
      orderIndex: 6
    }
  });

  console.log('✅ Created 6 categories');

  // 3. Fictional Demo Clothing Shops in Kolhapur
  const shop1 = await prisma.shop.create({
    data: {
      sellerProfileId: sellerUser1.sellerProfile!.id,
      name: 'Sagar Ethnic & Paithani Silk',
      slug: 'sagar-ethnic-paithani',
      description: 'Kolhapur’s flagship boutique for handcrafted Paithani sarees, festive men’s kurtas, and rich Indian weaves since 1988.',
      category: 'Ethnic & Festive Wear',
      logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80',
      phone: '+91 231 252 8899',
      email: 'sagar@sagarsilk.com',
      status: 'APPROVED',
      rating: 4.9,
      reviewCount: 48,
      isFeatured: true,
      streetAddress: 'Shop 14-16, Rajarampuri 2nd Lane',
      area: 'Rajarampuri',
      city: 'Kolhapur',
      state: 'Maharashtra',
      pincode: '416008',
      latitude: 16.6974,
      longitude: 74.2412,
      deliveryRadiusKm: 10.0,
      minOrderValue: 299.0,
      baseDeliveryFee: 30.0,
      freeDeliveryAbove: 799.0,
      allowsStorePickup: true,
      allowsHomeDelivery: true,
      serviceablePincodes: JSON.stringify(['416001', '416002', '416003', '416008', '416012']),
      openingHours: 'Mon-Sun: 10:00 AM - 9:30 PM'
    }
  });

  const shop2 = await prisma.shop.create({
    data: {
      sellerProfileId: sellerUser2.sellerProfile!.id,
      name: 'Royal Kolhapuri Chappals & Leather',
      slug: 'royal-kolhapuri-chappals',
      description: 'Master leather craftsmen crafting original vegetable-tanned Kolhapuri double-sole chappals and hand-braided mojris near Mahalaxmi Temple.',
      category: 'Footwear & Leather Craft',
      logoUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      phone: '+91 231 264 4511',
      email: 'sales@royalchappals.com',
      status: 'APPROVED',
      rating: 4.88,
      reviewCount: 72,
      isFeatured: true,
      streetAddress: 'Opposite Shivaji Chowk, Mahadwar Road',
      area: 'Mahalaxmi / Rankala',
      city: 'Kolhapur',
      state: 'Maharashtra',
      pincode: '416012',
      latitude: 16.6942,
      longitude: 74.2238,
      deliveryRadiusKm: 12.0,
      minOrderValue: 199.0,
      baseDeliveryFee: 40.0,
      freeDeliveryAbove: 999.0,
      allowsStorePickup: true,
      allowsHomeDelivery: true,
      serviceablePincodes: JSON.stringify(['416001', '416002', '416003', '416008', '416012']),
      openingHours: 'Mon-Sat: 10:30 AM - 8:30 PM'
    }
  });

  const shop3 = await prisma.shop.create({
    data: {
      sellerProfileId: sellerUser3.sellerProfile!.id,
      name: 'Shahupuri Trendz & Denim Studio',
      slug: 'shahupuri-trendz-denim',
      description: 'Modern western wear, street denim, oversized graphic tees, French linen shirts, and smart casuals in central Shahupuri.',
      category: 'Modern Casuals & Streetwear',
      logoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80',
      phone: '+91 231 265 1122',
      email: 'trendz@shahupuri.in',
      status: 'APPROVED',
      rating: 4.79,
      reviewCount: 39,
      isFeatured: true,
      streetAddress: 'City Center Arcade, 3rd Lane',
      area: 'Shahupuri',
      city: 'Kolhapur',
      state: 'Maharashtra',
      pincode: '416001',
      latitude: 16.7029,
      longitude: 74.2389,
      deliveryRadiusKm: 8.0,
      minOrderValue: 249.0,
      baseDeliveryFee: 35.0,
      freeDeliveryAbove: 699.0,
      allowsStorePickup: true,
      allowsHomeDelivery: true,
      serviceablePincodes: JSON.stringify(['416001', '416002', '416003', '416008', '416012']),
      openingHours: 'Mon-Sun: 11:00 AM - 9:00 PM'
    }
  });

  console.log('✅ Created 3 Kolhapur demo shops');

  // 4. Helper to create products with variants and inventory cleanly
  let productCount = 0;
  async function addProduct(p: {
    shopId: string;
    categoryId: string;
    title: string;
    description: string;
    gender: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
    fabric: string;
    brand: string;
    price: number;
    mrp: number;
    isFeatured?: boolean;
    tags: string[];
    images: string[];
    variants: { size: string; color: string; colorHex?: string; stock: number; price?: number }[];
  }) {
    productCount++;
    const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    const slug = `${p.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${productCount}`;

    return prisma.product.create({
      data: {
        shopId: p.shopId,
        categoryId: p.categoryId,
        title: p.title,
        slug,
        description: p.description,
        gender: p.gender,
        fabric: p.fabric,
        brand: p.brand,
        price: p.price,
        mrp: p.mrp,
        discountPct: discount,
        isFeatured: p.isFeatured || false,
        isAvailable: true,
        tags: JSON.stringify(p.tags),
        images: {
          create: p.images.map((url, idx) => ({
            url,
            altText: `${p.title} view ${idx + 1}`,
            isPrimary: idx === 0
          }))
        },
        variants: {
          create: p.variants.map((v, vIdx) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || '#111827',
            sku: `SKU-${productCount}-${vIdx}`,
            price: v.price,
            inventory: {
              create: {
                totalQuantity: v.stock,
                availableQuantity: v.stock,
                reservedQuantity: 0,
                lowStockAlert: 2
              }
            }
          }))
        }
      }
    });
  }

  // ==========================================
  // 50+ REAL CLOTHING CATALOG DATA
  // ==========================================

  // --- SECTION 1: MEN'S WEAR (12 Products) ---
  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Oversized Heavyweight Cotton Graphic Tee',
    description: '240 GSM combed cotton drop-shoulder silhouette with street typography print. Pre-shrunk bio-washed fabric for all-day comfort.',
    gender: 'MEN',
    fabric: '100% Combed Cotton',
    brand: 'Shahupuri Street',
    price: 549,
    mrp: 899,
    isFeatured: true,
    tags: ['t-shirt', 'oversized', 'black tee', 'streetwear', 'men'],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Midnight Black', colorHex: '#111827', stock: 8 },
      { size: 'M', color: 'Midnight Black', colorHex: '#111827', stock: 12 },
      { size: 'L', color: 'Midnight Black', colorHex: '#111827', stock: 10 },
      { size: 'XL', color: 'Midnight Black', colorHex: '#111827', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Essential Crewneck Supima White T-Shirt',
    description: 'Silky smooth premium long-staple Supima cotton tee with tailored crewneck collar and twin-needle hem.',
    gender: 'MEN',
    fabric: '100% Supima Cotton',
    brand: 'Shahupuri Basics',
    price: 449,
    mrp: 699,
    isFeatured: false,
    tags: ['white t-shirt', 'basics', 'cotton', 'men'],
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Optic White', colorHex: '#FFFFFF', stock: 10 },
      { size: 'M', color: 'Optic White', colorHex: '#FFFFFF', stock: 15 },
      { size: 'L', color: 'Optic White', colorHex: '#FFFFFF', stock: 12 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Classic Tartan Check Cotton Flannel Shirt',
    description: 'Double brushed 100% twill cotton plaid shirt with curved hem and dual chest pockets. Pairs effortlessly over raw denim.',
    gender: 'MEN',
    fabric: 'Brushed Cotton Flannel',
    brand: 'Heritage Mills',
    price: 899,
    mrp: 1399,
    isFeatured: true,
    tags: ['checked shirt', 'flannel', 'casual', 'autumn', 'men'],
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '38 (S)', color: 'Navy & Maroon Check', colorHex: '#1E3A8A', stock: 7 },
      { size: '40 (M)', color: 'Navy & Maroon Check', colorHex: '#1E3A8A', stock: 11 },
      { size: '42 (L)', color: 'Navy & Maroon Check', colorHex: '#1E3A8A', stock: 8 },
      { size: '44 (XL)', color: 'Navy & Maroon Check', colorHex: '#1E3A8A', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Pure French Linen Spread-Collar Resort Shirt',
    description: 'Airy, breathable summer shirt crafted from authentic European flax. Soft garment-washed feel with mother-of-pearl buttons.',
    gender: 'MEN',
    fabric: '100% French Flax Linen',
    brand: 'Shahupuri Trendz',
    price: 1199,
    mrp: 1799,
    isFeatured: true,
    tags: ['linen shirt', 'summer', 'resort', 'mint', 'men'],
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M', color: 'Mint Sage', colorHex: '#A7F3D0', stock: 9 },
      { size: 'L', color: 'Mint Sage', colorHex: '#A7F3D0', stock: 10 },
      { size: 'XL', color: 'Mint Sage', colorHex: '#A7F3D0', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Slim Fit Stretch Chino Trousers',
    description: 'Cotton twill trousers infused with 3% elastane for unrestricted movement. Deep slant pockets and clean zip fly.',
    gender: 'MEN',
    fabric: '97% Cotton, 3% Elastane',
    brand: 'Urban Craft',
    price: 849,
    mrp: 1299,
    isFeatured: false,
    tags: ['chinos', 'trousers', 'formal', 'beige', 'men'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '30W', color: 'Khaki Beige', colorHex: '#D2B48C', stock: 6 },
      { size: '32W', color: 'Khaki Beige', colorHex: '#D2B48C', stock: 10 },
      { size: '34W', color: 'Khaki Beige', colorHex: '#D2B48C', stock: 8 },
      { size: '36W', color: 'Khaki Beige', colorHex: '#D2B48C', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Formal Flat-Front Jet Black Trousers',
    description: 'Wrinkle-resistant poly-viscose formal trousers designed for office and ceremonies. Subtle stretch waistband.',
    gender: 'MEN',
    fabric: 'Poly-Viscose Stretch',
    brand: 'Executive Studio',
    price: 799,
    mrp: 1199,
    isFeatured: false,
    tags: ['black trousers', 'formal wear', 'office', 'men'],
    images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '30', color: 'Jet Black', colorHex: '#000000', stock: 5 },
      { size: '32', color: 'Jet Black', colorHex: '#000000', stock: 8 },
      { size: '34', color: 'Jet Black', colorHex: '#000000', stock: 8 },
      { size: '36', color: 'Jet Black', colorHex: '#000000', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catMens.id,
    title: 'Embroidered Silk Blend Festive Nehru Jacket',
    description: 'Sleeveless bandhgala waistcoat featuring delicate floral threadwork, brass buttons, and welt pockets. Worn over kurtas.',
    gender: 'MEN',
    fabric: 'Raw Silk Blend',
    brand: 'Sagar Men',
    price: 1399,
    mrp: 2199,
    isFeatured: true,
    tags: ['nehru jacket', 'waistcoat', 'wedding', 'men', 'festive'],
    images: ['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '38 (M)', color: 'Royal Mustard Gold', colorHex: '#D97706', stock: 4 },
      { size: '40 (L)', color: 'Royal Mustard Gold', colorHex: '#D97706', stock: 6 },
      { size: '42 (XL)', color: 'Royal Mustard Gold', colorHex: '#D97706', stock: 3 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catMens.id,
    title: 'Chanderi Silk Festive Kurta with Churidar Set',
    description: 'Traditional Lucknowi-inspired chanderi silk kurta with tonal thread embroidery and matching drawstring churidar.',
    gender: 'MEN',
    fabric: 'Chanderi Silk Blend',
    brand: 'Sagar Men',
    price: 1499,
    mrp: 2299,
    isFeatured: true,
    tags: ['kurta set', 'churidar', 'diwali', 'wedding', 'men'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M (38)', color: 'Ruby Wine', colorHex: '#881337', stock: 5 },
      { size: 'L (40)', color: 'Ruby Wine', colorHex: '#881337', stock: 8 },
      { size: 'XL (42)', color: 'Ruby Wine', colorHex: '#881337', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catMens.id,
    title: 'Handcrafted Cotton Silk Mandarin Collar Kurta',
    description: 'Comfortable, breathable cotton-silk blend with delicate thread embroidery on collar and cuffs. Tailored side slits with deep pockets.',
    gender: 'MEN',
    fabric: 'Cotton Silk',
    brand: 'Sagar Men',
    price: 899,
    mrp: 1299,
    isFeatured: true,
    tags: ['kurta', 'ethnic', 'men', 'cotton', 'diwali', 'wedding'],
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M (38)', color: 'Ivory Cream', colorHex: '#FEF3C7', stock: 12 },
      { size: 'L (40)', color: 'Ivory Cream', colorHex: '#FEF3C7', stock: 10 },
      { size: 'XL (42)', color: 'Ivory Cream', colorHex: '#FEF3C7', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Fleece Lined Pullover Street Hoodie',
    description: '320 GSM heavy brushed fleece hoodie with kangaroo pocket and double lined drawstring hood. Ultra soft inner lining.',
    gender: 'MEN',
    fabric: '80% Cotton, 20% Polyester',
    brand: 'Shahupuri Street',
    price: 999,
    mrp: 1599,
    isFeatured: false,
    tags: ['hoodie', 'sweatshirt', 'winter', 'men', 'streetwear'],
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M', color: 'Heather Charcoal', colorHex: '#374151', stock: 7 },
      { size: 'L', color: 'Heather Charcoal', colorHex: '#374151', stock: 9 },
      { size: 'XL', color: 'Heather Charcoal', colorHex: '#374151', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Short Sleeve Pique Cotton Polo Shirt',
    description: 'Classic ribbed polo collar with two-button placket and breathable honeycomb knit pique construction.',
    gender: 'MEN',
    fabric: '100% Pique Cotton',
    brand: 'Urban Craft',
    price: 599,
    mrp: 899,
    isFeatured: false,
    tags: ['polo', 't-shirt', 'casual', 'men'],
    images: ['https://images.unsplash.com/photo-1625910513413-5a04396b29f7?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Navy Blue', colorHex: '#1E3A8A', stock: 6 },
      { size: 'M', color: 'Navy Blue', colorHex: '#1E3A8A', stock: 11 },
      { size: 'L', color: 'Navy Blue', colorHex: '#1E3A8A', stock: 9 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catMens.id,
    title: 'Vintage Trucker Denim Jacket with Metal Buttons',
    description: 'Classic 13oz cotton denim jacket with contrast stitch, button-flap chest pockets, and waist adjusters.',
    gender: 'MEN',
    fabric: '100% Cotton Denim',
    brand: 'Shahupuri Denim Co.',
    price: 1399,
    mrp: 2099,
    isFeatured: true,
    tags: ['denim jacket', 'outerwear', 'jacket', 'men'],
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M', color: 'Stonewashed Blue', colorHex: '#3B82F6', stock: 6 },
      { size: 'L', color: 'Stonewashed Blue', colorHex: '#3B82F6', stock: 8 },
      { size: 'XL', color: 'Stonewashed Blue', colorHex: '#3B82F6', stock: 4 }
    ]
  });

  // --- SECTION 2: WOMEN'S WEAR (12 Products) ---
  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Jaipuri Hand-Block Printed Cotton A-Line Kurti',
    description: 'Pure cambric cotton A-line kurti with traditional floral Sanganeri motifs, 3/4 sleeves, and mandarin notch neck.',
    gender: 'WOMEN',
    fabric: '100% Cambric Cotton',
    brand: 'Sagar Heritage',
    price: 599,
    mrp: 899,
    isFeatured: true,
    tags: ['kurti', 'cotton kurti', 'hand block', 'ethnic', 'women'],
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S (36)', color: 'Indigo Blue', colorHex: '#1E40AF', stock: 9 },
      { size: 'M (38)', color: 'Indigo Blue', colorHex: '#1E40AF', stock: 14 },
      { size: 'L (40)', color: 'Indigo Blue', colorHex: '#1E40AF', stock: 12 },
      { size: 'XL (42)', color: 'Indigo Blue', colorHex: '#1E40AF', stock: 7 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Tiered Floral Chiffon Maxi Sundress',
    description: 'Flowy bohemian maxi dress with sweetheart neck, flutter cap sleeves, and smocked back bodice for forgiving fit.',
    gender: 'WOMEN',
    fabric: 'Georgette Chiffon with Lining',
    brand: 'Boutique Rose',
    price: 1099,
    mrp: 1699,
    isFeatured: true,
    tags: ['maxi dress', 'floral', 'summer dress', 'women'],
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Blush Floral', colorHex: '#FBCFE8', stock: 6 },
      { size: 'M', color: 'Blush Floral', colorHex: '#FBCFE8', stock: 8 },
      { size: 'L', color: 'Blush Floral', colorHex: '#FBCFE8', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Chanderi Anarkali Kurta with Silk Dupatta Set',
    description: 'Floor length pleated Anarkali suit set adorned with gota patti borders, thread embroidery, and matching silk dupatta.',
    gender: 'WOMEN',
    fabric: 'Chanderi Silk & Zari',
    brand: 'Sagar Heritage',
    price: 1899,
    mrp: 2799,
    isFeatured: true,
    tags: ['anarkali', 'suit set', 'festive', 'wedding', 'women'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M (38)', color: 'Teal Peacock', colorHex: '#0D9488', stock: 6 },
      { size: 'L (40)', color: 'Teal Peacock', colorHex: '#0D9488', stock: 8 },
      { size: 'XL (42)', color: 'Teal Peacock', colorHex: '#0D9488', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catWomens.id,
    title: 'High-Rise Wide-Leg Relaxed Fit Denim',
    description: 'Flattering high-rise waist with relaxed wide legs through the thigh and ankle. Rigid cotton denim in clean sky wash.',
    gender: 'WOMEN',
    fabric: '100% Cotton Denim',
    brand: 'Shahupuri Denim Co.',
    price: 1049,
    mrp: 1599,
    isFeatured: true,
    tags: ['wide leg jeans', 'denim', 'casual', 'women'],
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '26', color: 'Sky Light Wash', colorHex: '#93C5FD', stock: 5 },
      { size: '28', color: 'Sky Light Wash', colorHex: '#93C5FD', stock: 9 },
      { size: '30', color: 'Sky Light Wash', colorHex: '#93C5FD', stock: 10 },
      { size: '32', color: 'Sky Light Wash', colorHex: '#93C5FD', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Linen Blend Co-Ord Shirt and Wide Trouser Set',
    description: 'Contemporary two-piece co-ord set with button-front relaxed shirt and elasticated drawstring palazzo pants.',
    gender: 'WOMEN',
    fabric: '70% Linen, 30% Cotton',
    brand: 'Boutique Rose',
    price: 1399,
    mrp: 2099,
    isFeatured: false,
    tags: ['co-ord set', 'linen', 'western wear', 'women'],
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Oatmeal Beige', colorHex: '#E5E7EB', stock: 7 },
      { size: 'M', color: 'Oatmeal Beige', colorHex: '#E5E7EB', stock: 10 },
      { size: 'L', color: 'Oatmeal Beige', colorHex: '#E5E7EB', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Pure Lycra 4-Way Stretch Ankle Leggings',
    description: 'Bio-washed combed cotton leggings with elastane stretch and broad elasticated waistband. Zero transparency guarantee.',
    gender: 'WOMEN',
    fabric: '95% Cotton, 5% Lycra',
    brand: 'Daily Comfort',
    price: 349,
    mrp: 499,
    isFeatured: false,
    tags: ['leggings', 'basics', 'stretch', 'women'],
    images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (28-36)', color: 'Solid Black', colorHex: '#000000', stock: 25 },
      { size: 'Free Size (28-36)', color: 'Churidar Maroon', colorHex: '#831843', stock: 18 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catWomens.id,
    title: 'Ribbed Knit Square-Neck Fitted Top',
    description: 'Stretchy ribbed knit top with structured square neckline and short sleeves. Looks chic tucked into high-waist trousers.',
    gender: 'WOMEN',
    fabric: 'Viscose Ribbed Knit',
    brand: 'Shahupuri Basics',
    price: 499,
    mrp: 799,
    isFeatured: false,
    tags: ['ribbed top', 'casual', 'western', 'women'],
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Mocha Brown', colorHex: '#78350F', stock: 8 },
      { size: 'M', color: 'Mocha Brown', colorHex: '#78350F', stock: 12 },
      { size: 'L', color: 'Mocha Brown', colorHex: '#78350F', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Gold Zari Border Handwoven Chanderi Kurti',
    description: 'Handcrafted chanderi cotton-silk straight kurti with delicate gold zari butti weave on sleeves and keyhole neckline.',
    gender: 'WOMEN',
    fabric: 'Chanderi Cotton Silk',
    brand: 'Sagar Heritage',
    price: 799,
    mrp: 1199,
    isFeatured: true,
    tags: ['chanderi', 'kurti', 'festive', 'gold zari', 'women'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S (36)', color: 'Crimson Red', colorHex: '#991B1B', stock: 7 },
      { size: 'M (38)', color: 'Crimson Red', colorHex: '#991B1B', stock: 9 },
      { size: 'L (40)', color: 'Crimson Red', colorHex: '#991B1B', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catWomens.id,
    title: 'Floral Puff Sleeve Midi Wrap Dress',
    description: 'Flattering crossover V-neck wrap dress with side tie fastening and playful puff sleeves in ditsy floral print.',
    gender: 'WOMEN',
    fabric: 'Breathable Rayon',
    brand: 'Boutique Rose',
    price: 949,
    mrp: 1399,
    isFeatured: false,
    tags: ['wrap dress', 'midi dress', 'casual', 'women'],
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Marigold Yellow', colorHex: '#F59E0B', stock: 6 },
      { size: 'M', color: 'Marigold Yellow', colorHex: '#F59E0B', stock: 8 },
      { size: 'L', color: 'Marigold Yellow', colorHex: '#F59E0B', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Bandhani Print Rayon Flared Palazzo Suit',
    description: 'Traditional Gujarati-Maharashtrian tie-dye bandhani printed kurti paired with wide hem flare palazzos and chiffon stole.',
    gender: 'WOMEN',
    fabric: 'Heavy 14kg Rayon',
    brand: 'Sagar Heritage',
    price: 899,
    mrp: 1399,
    isFeatured: false,
    tags: ['bandhani', 'palazzo suit', 'ethnic', 'women'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M', color: 'Royal Green & Red', colorHex: '#047857', stock: 8 },
      { size: 'L', color: 'Royal Green & Red', colorHex: '#047857', stock: 10 },
      { size: 'XL', color: 'Royal Green & Red', colorHex: '#047857', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catWomens.id,
    title: 'Cropped Cotton Denim Trucker Jacket',
    description: 'Feminine cropped silhouette denim jacket with distressed wash and silver shank buttons.',
    gender: 'WOMEN',
    fabric: '100% Cotton Denim',
    brand: 'Shahupuri Denim Co.',
    price: 1149,
    mrp: 1699,
    isFeatured: false,
    tags: ['denim jacket', 'cropped', 'jacket', 'women'],
    images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Vintage Light Blue', colorHex: '#60A5FA', stock: 6 },
      { size: 'M', color: 'Vintage Light Blue', colorHex: '#60A5FA', stock: 9 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catWomens.id,
    title: 'Chikankari Hand Embroidered White Kurti',
    description: 'Pure georgette tunic embroidered with intricate shadow and keel kangan chikankari stitch. Comes with inner cotton slip.',
    gender: 'WOMEN',
    fabric: 'Georgette with Cotton Slip',
    brand: 'Sagar Heritage',
    price: 1299,
    mrp: 1899,
    isFeatured: true,
    tags: ['chikankari', 'lucknowi', 'white kurti', 'women'],
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Pristine White', colorHex: '#FFFFFF', stock: 7 },
      { size: 'M', color: 'Pristine White', colorHex: '#FFFFFF', stock: 11 },
      { size: 'L', color: 'Pristine White', colorHex: '#FFFFFF', stock: 8 }
    ]
  });

  // --- SECTION 3: ETHNIC & PAITHANI SAREES (10 Products) ---
  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Handloom Kolhapuri Pure Silk Paithani Saree',
    description: 'Pure mulberry silk saree with exquisite peacock mor-butti motif zari pallu and contrast royal gold border. Includes unstitched blouse piece.',
    gender: 'WOMEN',
    fabric: 'Pure Silk with Zari',
    brand: 'Sagar Heritage',
    price: 3499,
    mrp: 4999,
    isFeatured: true,
    tags: ['paithani', 'silk', 'festive', 'saree', 'kolhapur', 'wedding'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Royal Magenta & Gold', colorHex: '#9D174D', stock: 6 },
      { size: 'Free Size (6.3m)', color: 'Emerald Green & Gold', colorHex: '#065F46', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Traditional Kolhapuri Nauvari (9 Yard) Kashta Saree',
    description: 'Authentic 9-yard Maharashtrian Nauvari cotton-silk drape. Classic Ganga-Jamuna border ideal for Gudi Padwa and traditional weddings.',
    gender: 'WOMEN',
    fabric: 'Cotton Silk Maharashtrian Weave',
    brand: 'Sagar Heritage',
    price: 2299,
    mrp: 3199,
    isFeatured: true,
    tags: ['nauvari', '9 yard', 'kashta', 'maharashtrian', 'saree'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '9 Yards (Nauvari)', color: 'Traditional Sunset Yellow', colorHex: '#EAB308', stock: 7 },
      { size: '9 Yards (Nauvari)', color: 'Peacock Green', colorHex: '#0F766E', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Banarasi Katan Silk Brocade Wedding Saree',
    description: 'Heavy gold and silver zari brocade weaving across the body with rich floral jaal design and opulent ornate pallu.',
    gender: 'WOMEN',
    fabric: 'Pure Katan Silk & Zari',
    brand: 'Sagar Heritage',
    price: 4299,
    mrp: 5999,
    isFeatured: true,
    tags: ['banarasi', 'katan silk', 'wedding saree', 'zari'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Deep Sindoor Red', colorHex: '#B91C1C', stock: 5 },
      { size: 'Free Size (6.3m)', color: 'Royal Rani Pink', colorHex: '#BE185D', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Kanjivaram Style Temple Border Silk Saree',
    description: 'Lustrous south-silk weave with signature korvai temple triangular borders and heavy gold zari diamond work.',
    gender: 'WOMEN',
    fabric: 'Lustrous Silk Blend',
    brand: 'Sagar Heritage',
    price: 2899,
    mrp: 3999,
    isFeatured: false,
    tags: ['kanjivaram', 'temple border', 'silk saree', 'festive'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Electric Purple & Mustard', colorHex: '#7E22CE', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Handloom Maheshwari Cotton-Silk Daily Saree',
    description: 'Lightweight, feather-soft Maheshwari drape with subtle zari patti border and geometric pallu. Extremely breathable for daily office.',
    gender: 'WOMEN',
    fabric: 'Maheshwari Cotton Silk',
    brand: 'Sagar Heritage',
    price: 1399,
    mrp: 1899,
    isFeatured: false,
    tags: ['maheshwari', 'cotton silk', 'daily wear', 'saree'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Forest Olive Green', colorHex: '#3F6212', stock: 8 },
      { size: 'Free Size (6.3m)', color: 'Earth Rust Orange', colorHex: '#C2410C', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Organza Floral Digital Print Saree with Scallop Border',
    description: 'Sheer translucent organza saree with pastel watercolor blooms and hand-embroidered cutwork scallop embroidery.',
    gender: 'WOMEN',
    fabric: 'Pure Sheer Organza',
    brand: 'Boutique Rose',
    price: 1699,
    mrp: 2399,
    isFeatured: true,
    tags: ['organza', 'scallop border', 'partywear', 'saree'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Lavender Mist', colorHex: '#C084FC', stock: 6 },
      { size: 'Free Size (6.3m)', color: 'Powder Blue', colorHex: '#93C5FD', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Chanderi Zari Check Saree with Contrast Blouse',
    description: 'Traditional tissue-touch chanderi check weave with contrasting resham border and unstitched brocade blouse.',
    gender: 'WOMEN',
    fabric: 'Chanderi Zari Blend',
    brand: 'Sagar Heritage',
    price: 1799,
    mrp: 2499,
    isFeatured: false,
    tags: ['chanderi', 'zari check', 'saree', 'festive'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Copper Gold & Black', colorHex: '#78350F', stock: 7 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Yeola Handloom Semi-Paithani with Muniya Border',
    description: 'Woven in Yeola near Nashik, featuring iconic parrot (muniya) border and shimmering gold pallu at an affordable price.',
    gender: 'WOMEN',
    fabric: 'Art Silk Semi-Paithani',
    brand: 'Sagar Heritage',
    price: 2199,
    mrp: 2999,
    isFeatured: false,
    tags: ['semi paithani', 'muniya border', 'yeola', 'saree'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Cobalt Blue & Red', colorHex: '#1D4ED8', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Tussar Silk Hand Block Printed Saree',
    description: 'Textured wild tussar silk featuring earthy geometric bagru block printing and raw tasseled pallu.',
    gender: 'WOMEN',
    fabric: 'Wild Tussar Silk',
    brand: 'Sagar Heritage',
    price: 2599,
    mrp: 3499,
    isFeatured: false,
    tags: ['tussar silk', 'block print', 'handloom', 'saree'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Beige & Indigo', colorHex: '#D1D5DB', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catEthnic.id,
    title: 'Bandhani Gota Patti Pure Georgette Saree',
    description: 'Authentic tie-dyed bandhej dots on georgette fabric trimmed with opulent Rajasthani gota patti handwork.',
    gender: 'WOMEN',
    fabric: 'Pure Georgette with Gota Patti',
    brand: 'Sagar Heritage',
    price: 1999,
    mrp: 2899,
    isFeatured: true,
    tags: ['bandhani', 'gota patti', 'georgette saree', 'wedding'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Free Size (6.3m)', color: 'Bright Vermilion Orange', colorHex: '#EA580C', stock: 7 }
    ]
  });

  // --- SECTION 4: KIDS' WEAR (10 Products) ---
  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Boys Festive Cotton Kurta Pyjama Set',
    description: 'Soft 100% breathable cotton mandarin collar kurta with easy elasticated white pyjama. Child-safe wooden buttons.',
    gender: 'KIDS',
    fabric: '100% Cotton',
    brand: 'Little Kolhapur',
    price: 549,
    mrp: 799,
    isFeatured: true,
    tags: ['kids kurta', 'boys ethnic', 'cotton pyjama', 'kids'],
    images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '2-3 Years', color: 'Mustard Yellow', colorHex: '#EAB308', stock: 8 },
      { size: '4-5 Years', color: 'Mustard Yellow', colorHex: '#EAB308', stock: 10 },
      { size: '6-7 Years', color: 'Mustard Yellow', colorHex: '#EAB308', stock: 7 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Girls Tiered Floral Cotton Frock with Bow',
    description: 'Charming sleeveless summer dress with ruffled flutter shoulders, tiered skirt, and tie-back satin sash.',
    gender: 'KIDS',
    fabric: '100% Pure Cotton with Cotton Lining',
    brand: 'Little Kolhapur',
    price: 499,
    mrp: 749,
    isFeatured: true,
    tags: ['girls frock', 'cotton dress', 'summer dress', 'kids'],
    images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '2-3 Years', color: 'Peach Floral', colorHex: '#FED7AA', stock: 7 },
      { size: '4-5 Years', color: 'Peach Floral', colorHex: '#FED7AA', stock: 9 },
      { size: '6-7 Years', color: 'Peach Floral', colorHex: '#FED7AA', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Boys Stretch Denim Jeans with Elastic Waist',
    description: 'Kid-friendly pull-on denim with interior soft elastic waist and faux fly. Extra durable double-layer knee stitching.',
    gender: 'KIDS',
    fabric: 'Cotton Stretch Denim',
    brand: 'Little Kolhapur',
    price: 599,
    mrp: 899,
    isFeatured: false,
    tags: ['kids jeans', 'boys denim', 'stretch pants', 'kids'],
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '3-4 Years', color: 'Dark Denim Wash', colorHex: '#1E3A8A', stock: 8 },
      { size: '5-6 Years', color: 'Dark Denim Wash', colorHex: '#1E3A8A', stock: 10 },
      { size: '7-8 Years', color: 'Dark Denim Wash', colorHex: '#1E3A8A', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Baby Unisex Organic Cotton Romper Jumpsuit',
    description: 'Super soft GOTS-certified organic cotton onesie with snap button bottom for quick diaper changes.',
    gender: 'KIDS',
    fabric: '100% Organic Cotton',
    brand: 'Baby Bloom',
    price: 399,
    mrp: 599,
    isFeatured: false,
    tags: ['baby romper', 'organic cotton', 'onesie', 'infant'],
    images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '0-3 Months', color: 'Sage Green', colorHex: '#86EFAC', stock: 12 },
      { size: '3-6 Months', color: 'Sage Green', colorHex: '#86EFAC', stock: 14 },
      { size: '6-12 Months', color: 'Sage Green', colorHex: '#86EFAC', stock: 10 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catKids.id,
    title: 'Girls Silk Parkar Polka (Traditional Lehenga Set)',
    description: 'Traditional Maharashtrian parkar polka set with gold zari brocade blouse and flared pleated skirt.',
    gender: 'KIDS',
    fabric: 'Art Silk Brocade',
    brand: 'Sagar Heritage',
    price: 899,
    mrp: 1299,
    isFeatured: true,
    tags: ['parkar polka', 'traditional lehenga', 'girls ethnic', 'kids'],
    images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '2-3 Years', color: 'Royal Red & Green', colorHex: '#991B1B', stock: 6 },
      { size: '4-5 Years', color: 'Royal Red & Green', colorHex: '#991B1B', stock: 8 },
      { size: '6-7 Years', color: 'Royal Red & Green', colorHex: '#991B1B', stock: 5 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Boys Dinosaur Print Cotton T-Shirt',
    description: 'Vibrant graphic dinosaur tee in 100% combed cotton jersey with ribbed collar and itch-free heat-seal label.',
    gender: 'KIDS',
    fabric: '100% Combed Cotton',
    brand: 'Little Kolhapur',
    price: 349,
    mrp: 499,
    isFeatured: false,
    tags: ['boys t-shirt', 'graphic tee', 'casual', 'kids'],
    images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '3-4 Years', color: 'Navy Graphic', colorHex: '#1E3A8A', stock: 10 },
      { size: '5-6 Years', color: 'Navy Graphic', colorHex: '#1E3A8A', stock: 12 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Girls Partywear Sequin Net Tutu Frock',
    description: 'Sparkling sequined bodice with layered soft tulle tutu skirt and gentle cotton under-lining.',
    gender: 'KIDS',
    fabric: 'Tulle Net with Cotton Lining',
    brand: 'Little Kolhapur',
    price: 799,
    mrp: 1199,
    isFeatured: false,
    tags: ['party dress', 'sequin frock', 'tutu', 'kids'],
    images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '3-4 Years', color: 'Princess Pink', colorHex: '#F472B6', stock: 6 },
      { size: '5-6 Years', color: 'Princess Pink', colorHex: '#F472B6', stock: 7 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Boys Checked Cotton Shirt with Bowtie',
    description: 'Smart button-down long sleeve woven shirt with detachable clip-on red bowtie for festive celebrations.',
    gender: 'KIDS',
    fabric: '100% Poplin Cotton',
    brand: 'Little Kolhapur',
    price: 649,
    mrp: 949,
    isFeatured: false,
    tags: ['boys shirt', 'partywear', 'bowtie', 'kids'],
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '4-5 Years', color: 'Blue Tartan Check', colorHex: '#2563EB', stock: 7 },
      { size: '6-7 Years', color: 'Blue Tartan Check', colorHex: '#2563EB', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catKids.id,
    title: 'Infant Cotton Footie Sleepsuit with Zipper',
    description: 'Full-length zip baby sleeper with enclosed feet and anti-pinch safety tab at the neck. Cozy nightwear.',
    gender: 'KIDS',
    fabric: 'Interlock Knit Cotton',
    brand: 'Baby Bloom',
    price: 449,
    mrp: 649,
    isFeatured: false,
    tags: ['baby sleeper', 'sleepsuit', 'infant', 'footie'],
    images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '3-6 Months', color: 'Cloud Grey Stars', colorHex: '#9CA3AF', stock: 11 },
      { size: '6-12 Months', color: 'Cloud Grey Stars', colorHex: '#9CA3AF', stock: 10 }
    ]
  });

  await addProduct({
    shopId: shop1.id,
    categoryId: catKids.id,
    title: 'Boys Dhoti Kurta Set with Brocade Border',
    description: 'Traditional readymade stitched pleated dhoti with contrast silk kurta and gold brocade trim.',
    gender: 'KIDS',
    fabric: 'Cotton Silk Blend',
    brand: 'Sagar Heritage',
    price: 749,
    mrp: 1099,
    isFeatured: false,
    tags: ['dhoti kurta', 'boys festive', 'ethnic', 'kids'],
    images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '3-4 Years', color: 'Maroon & Cream', colorHex: '#991B1B', stock: 6 },
      { size: '5-6 Years', color: 'Maroon & Cream', colorHex: '#991B1B', stock: 8 }
    ]
  });

  // --- SECTION 5: FOOTWEAR & KOLHAPURI CHAPPALS (10 Products) ---
  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Original Kolhapuri Double-Sole Handcrafted Leather Chappal',
    description: 'Direct from Mahadwar Road master craftsmen. Natural vegetable tanned leather, traditional braided thong, punch-hole design, and soft under-sole cushioning.',
    gender: 'MEN',
    fabric: '100% Genuine Buffalo Leather',
    brand: 'Royal Kolhapur',
    price: 749,
    mrp: 999,
    isFeatured: true,
    tags: ['kolhapuri', 'chappal', 'leather', 'handcrafted', 'heritage'],
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'UK 7', color: 'Classic Tan Brown', colorHex: '#78350F', stock: 12 },
      { size: 'UK 8', color: 'Classic Tan Brown', colorHex: '#78350F', stock: 15 },
      { size: 'UK 9', color: 'Classic Tan Brown', colorHex: '#78350F', stock: 14 },
      { size: 'UK 10', color: 'Classic Tan Brown', colorHex: '#78350F', stock: 9 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Women’s Rose Gold Metallic Accent Kolhapuri Sandal',
    description: 'Elegant artisan sandals adorned with soft braided metallic straps and padded velvet insole for effortless all-day festive comfort.',
    gender: 'WOMEN',
    fabric: 'Leather & Velvet Cushion',
    brand: 'Royal Kolhapur',
    price: 649,
    mrp: 899,
    isFeatured: true,
    tags: ['women footwear', 'kolhapuri', 'sandals', 'festive'],
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'IND 5', color: 'Rose Gold & Antique', colorHex: '#FDA4AF', stock: 8 },
      { size: 'IND 6', color: 'Rose Gold & Antique', colorHex: '#FDA4AF', stock: 11 },
      { size: 'IND 7', color: 'Rose Gold & Antique', colorHex: '#FDA4AF', stock: 9 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Kolhapuri Shendri Braided Red Silk Thread Chappal',
    description: 'Famous Maharashtrian Shendri chappal featuring bright scarlet red silk cord braid across the vamp with hand-carved leather tooling.',
    gender: 'MEN',
    fabric: 'Buffalo Leather & Silk Cord',
    brand: 'Royal Kolhapur',
    price: 849,
    mrp: 1199,
    isFeatured: true,
    tags: ['shendri', 'kolhapuri chappal', 'red cord', 'artisan'],
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'UK 7', color: 'Natural Tan with Red Silk', colorHex: '#991B1B', stock: 7 },
      { size: 'UK 8', color: 'Natural Tan with Red Silk', colorHex: '#991B1B', stock: 10 },
      { size: 'UK 9', color: 'Natural Tan with Red Silk', colorHex: '#991B1B', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Women’s Mirror Work Embroidered Kolhapuri Mojri',
    description: 'Round-toe traditional slip-on mojri shoe with brass mirror embellishments and genuine cushioned leather sole.',
    gender: 'WOMEN',
    fabric: 'Raw Silk & Leather',
    brand: 'Royal Kolhapur',
    price: 799,
    mrp: 1099,
    isFeatured: false,
    tags: ['mojri', 'women footwear', 'mirror work', 'jooti'],
    images: ['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'IND 5', color: 'Golden Mustard', colorHex: '#EAB308', stock: 6 },
      { size: 'IND 6', color: 'Golden Mustard', colorHex: '#EAB308', stock: 8 },
      { size: 'IND 7', color: 'Golden Mustard', colorHex: '#EAB308', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Men’s Handcrafted Leather Oxford Loafers',
    description: 'Supple full-grain cowhide leather slip-on loafers with stacked wooden heel and breathable arch support.',
    gender: 'MEN',
    fabric: 'Full-Grain Cowhide Leather',
    brand: 'Royal Leather Studio',
    price: 1499,
    mrp: 2299,
    isFeatured: true,
    tags: ['loafers', 'formal shoes', 'leather', 'men'],
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'UK 8', color: 'Cognac Brown', colorHex: '#9A3412', stock: 6 },
      { size: 'UK 9', color: 'Cognac Brown', colorHex: '#9A3412', stock: 7 },
      { size: 'UK 10', color: 'Cognac Brown', colorHex: '#9A3412', stock: 4 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Hand-Stitched Triple Braided Open Toe Chappal',
    description: 'Intricately woven triple leather braids over the instep with authentic Kolhapuri edge squeak and grooved traction rubber bottom.',
    gender: 'MEN',
    fabric: 'Heavy Buffalo Leather',
    brand: 'Royal Kolhapur',
    price: 799,
    mrp: 1099,
    isFeatured: false,
    tags: ['kolhapuri', 'braided', 'leather chappal', 'men'],
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'UK 8', color: 'Deep Walnut', colorHex: '#451A03', stock: 8 },
      { size: 'UK 9', color: 'Deep Walnut', colorHex: '#451A03', stock: 9 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Women’s Ankle-Strap Block Heel Kolhapuri Sandal',
    description: 'Modern 2-inch block heel fusion sandal with authentic braided Kolhapuri front strap and secure buckle ankle support.',
    gender: 'WOMEN',
    fabric: 'Leather with Synthetic Heel',
    brand: 'Royal Kolhapur',
    price: 899,
    mrp: 1299,
    isFeatured: false,
    tags: ['block heel', 'kolhapuri heel', 'sandals', 'women'],
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'IND 6', color: 'Muted Gold', colorHex: '#CA8A04', stock: 7 },
      { size: 'IND 7', color: 'Muted Gold', colorHex: '#CA8A04', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Royal Wedding Zari Embellished Men’s Mojri',
    description: 'Pointed curved toe khussa mojri with royal velvet upper and dense gold thread zari embroidery. Fits sherwanis perfectly.',
    gender: 'MEN',
    fabric: 'Velvet & Leather Base',
    brand: 'Royal Kolhapur',
    price: 999,
    mrp: 1499,
    isFeatured: false,
    tags: ['sherwani mojri', 'wedding shoes', 'jooti', 'men'],
    images: ['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'UK 8', color: 'Royal Maroon & Gold', colorHex: '#831843', stock: 5 },
      { size: 'UK 9', color: 'Royal Maroon & Gold', colorHex: '#831843', stock: 6 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Hand-Cut Pure Leather Mens Casual Belt',
    description: '35mm wide genuine full-grain leather belt with solid brushed brass pin buckle. Hand-burnished edges.',
    gender: 'MEN',
    fabric: '100% Full-Grain Leather',
    brand: 'Royal Leather Studio',
    price: 499,
    mrp: 799,
    isFeatured: false,
    tags: ['leather belt', 'accessories', 'men'],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '32-34 in', color: 'Dark Chocolate Brown', colorHex: '#3E2723', stock: 15 },
      { size: '36-38 in', color: 'Dark Chocolate Brown', colorHex: '#3E2723', stock: 12 }
    ]
  });

  await addProduct({
    shopId: shop2.id,
    categoryId: catFootwear.id,
    title: 'Handcrafted Vegetable-Tanned Leather Tote Bag',
    description: 'Spacious daily tote bag with reinforced double handles, antique brass YKK zip closure, and interior zip compartment.',
    gender: 'WOMEN',
    fabric: '100% Natural Tanned Leather',
    brand: 'Royal Leather Studio',
    price: 1999,
    mrp: 2999,
    isFeatured: true,
    tags: ['leather tote', 'bag', 'handcrafted', 'women'],
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'Standard (15x12 in)', color: 'Vintage Honey Tan', colorHex: '#B45309', stock: 8 }
    ]
  });

  // --- SECTION 6: DENIM & CASUALS (6 Products) ---
  await addProduct({
    shopId: shop3.id,
    categoryId: catDenim.id,
    title: 'Vintage Wash Straight Fit Comfort Stretch Jeans',
    description: '12.5oz cotton-spandex denim designed for rugged durability and relaxed all-day comfort. Subtle whiskering with reinforced copper stitching.',
    gender: 'UNISEX',
    fabric: '98% Cotton, 2% Spandex',
    brand: 'Shahupuri Denim Co.',
    price: 999,
    mrp: 1499,
    isFeatured: true,
    tags: ['jeans', 'denim', 'casual', 'stretch', 'men'],
    images: ['https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '30W', color: 'Mid Indigo Wash', colorHex: '#1E3A8A', stock: 10 },
      { size: '32W', color: 'Mid Indigo Wash', colorHex: '#1E3A8A', stock: 14 },
      { size: '34W', color: 'Mid Indigo Wash', colorHex: '#1E3A8A', stock: 12 },
      { size: '36W', color: 'Mid Indigo Wash', colorHex: '#1E3A8A', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catDenim.id,
    title: 'Utility Multi-Pocket Cargo Trousers',
    description: 'Heavy duty cotton ripstop cargo pants with 6 reinforced pockets, knee darts, and adjustable ankle cinch cord.',
    gender: 'UNISEX',
    fabric: '100% Cotton Ripstop',
    brand: 'Shahupuri Street',
    price: 1099,
    mrp: 1599,
    isFeatured: true,
    tags: ['cargo pants', 'streetwear', 'utility', 'pants'],
    images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M (32)', color: 'Military Olive Green', colorHex: '#365314', stock: 8 },
      { size: 'L (34)', color: 'Military Olive Green', colorHex: '#365314', stock: 11 },
      { size: 'XL (36)', color: 'Military Olive Green', colorHex: '#365314', stock: 7 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catDenim.id,
    title: 'Drop-Shoulder Washed Cotton Acid Wash Tee',
    description: 'Mineral washed vintage effect jersey cotton T-shirt with raw cut cuffs and loose silhouette.',
    gender: 'UNISEX',
    fabric: '100% Cotton Jersey',
    brand: 'Shahupuri Street',
    price: 499,
    mrp: 799,
    isFeatured: false,
    tags: ['acid wash', 't-shirt', 'oversized', 'streetwear'],
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'S', color: 'Faded Charcoal', colorHex: '#4B5563', stock: 8 },
      { size: 'M', color: 'Faded Charcoal', colorHex: '#4B5563', stock: 12 },
      { size: 'L', color: 'Faded Charcoal', colorHex: '#4B5563', stock: 10 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catDenim.id,
    title: 'Slim Tapered Jet Black Raw Denim Jeans',
    description: 'Deep sulfur dyed black denim with clean rivet detailing and zero fading. Stays pitch black even after repeated washes.',
    gender: 'MEN',
    fabric: '99% Cotton, 1% Spandex',
    brand: 'Shahupuri Denim Co.',
    price: 1149,
    mrp: 1699,
    isFeatured: false,
    tags: ['black jeans', 'denim', 'slim fit', 'men'],
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: '30W', color: 'Pitch Black', colorHex: '#000000', stock: 9 },
      { size: '32W', color: 'Pitch Black', colorHex: '#000000', stock: 13 },
      { size: '34W', color: 'Pitch Black', colorHex: '#000000', stock: 10 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catDenim.id,
    title: 'Heavy Twill Worker Overshirt Jacket',
    description: 'Substantial cotton twill overshirt with pointed collar, matte horn buttons, and twin chest patch pockets.',
    gender: 'UNISEX',
    fabric: '100% Heavy Twill Cotton',
    brand: 'Shahupuri Denim Co.',
    price: 1249,
    mrp: 1799,
    isFeatured: false,
    tags: ['overshirt', 'shacket', 'casual jacket', 'twill'],
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M', color: 'Camel Tan', colorHex: '#B45309', stock: 6 },
      { size: 'L', color: 'Camel Tan', colorHex: '#B45309', stock: 8 }
    ]
  });

  await addProduct({
    shopId: shop3.id,
    categoryId: catDenim.id,
    title: 'Cotton French Terry Relaxed Jogger Pants',
    description: 'Premium loopback French terry sweatpants with drawcord waistband, deep side pockets, and snug ribbed ankle cuffs.',
    gender: 'UNISEX',
    fabric: '100% French Terry Cotton',
    brand: 'Shahupuri Basics',
    price: 699,
    mrp: 999,
    isFeatured: false,
    tags: ['joggers', 'sweatpants', 'lounge', 'casual'],
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80'],
    variants: [
      { size: 'M', color: 'Melange Grey', colorHex: '#6B7280', stock: 9 },
      { size: 'L', color: 'Melange Grey', colorHex: '#6B7280', stock: 11 }
    ]
  });

  console.log(`✅ Seeded ${productCount} authentic fashion products with complete variants and inventory!`);

  // 6. Promotional Coupons
  await prisma.coupon.create({
    data: {
      code: 'KOLHAPUR100',
      description: 'Flat ₹100 OFF on your first local Kolhapur order above ₹499',
      discountType: 'FIXED',
      value: 100.0,
      minOrderVal: 499.0,
      maxDiscount: 100.0,
      isActive: true
    }
  });

  await prisma.coupon.create({
    data: {
      code: 'NEARWEAR20',
      description: '20% Instant Discount on nearby boutique fashion (Up to ₹250)',
      discountType: 'PERCENT',
      value: 20.0,
      minOrderVal: 799.0,
      maxDiscount: 250.0,
      isActive: true
    }
  });

  // 7. Commission Rules
  await prisma.commissionRule.create({
    data: {
      name: 'Default Marketplace Commission',
      scope: 'DEFAULT',
      ratePercent: 8.0,
      minFee: 10.0,
      isActive: true
    }
  });

  // 8. Seed Sample Order for immediate order tracking verification
  const firstProd = await prisma.product.findFirst({
    where: { shopId: shop1.id },
    include: { variants: true }
  });

  const secondProd = await prisma.product.findFirst({
    where: { shopId: shop2.id },
    include: { variants: true }
  });

  if (firstProd && secondProd) {
    const order = await prisma.order.create({
      data: {
        orderNumber: 'NW-2026-KLH-8910',
        userId: customerUser.id,
        deliveryType: 'HOME_DELIVERY',
        deliveryAddress: 'Flat 302, Sai Heritage, 4th Lane, Rajarampuri, Kolhapur - 416008',
        customerName: 'Aarav Deshmukh',
        customerPhone: '+91 98220 12345',
        subtotalAmount: firstProd.price + secondProd.price,
        deliveryFeeTotal: 30.0,
        taxAmount: Math.round((firstProd.price + secondProd.price - 100) * 0.05 * 100) / 100,
        discountAmount: 100.0,
        couponCode: 'KOLHAPUR100',
        totalAmount: Math.round((firstProd.price + secondProd.price + 30 + (firstProd.price + secondProd.price - 100) * 0.05 - 100) * 100) / 100,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING'
      }
    });

    const so1 = await prisma.sellerOrder.create({
      data: {
        orderId: order.id,
        shopId: shop1.id,
        subOrderNumber: 'NW-2026-KLH-8910-S1',
        status: 'ACCEPTED',
        shopSubtotal: firstProd.price,
        deliveryFee: 30.0,
        platformCommission: Math.round(firstProd.price * 0.08 * 100) / 100,
        sellerPayable: Math.round((firstProd.price + 30 - firstProd.price * 0.08) * 100) / 100,
        acceptedAt: new Date()
      }
    });

    await prisma.orderItem.create({
      data: {
        sellerOrderId: so1.id,
        productId: firstProd.id,
        variantId: firstProd.variants[0].id,
        title: firstProd.title,
        size: firstProd.variants[0].size,
        color: firstProd.variants[0].color,
        quantity: 1,
        unitPrice: firstProd.price,
        totalPrice: firstProd.price,
        commissionPct: 8.0
      }
    });

    const so2 = await prisma.sellerOrder.create({
      data: {
        orderId: order.id,
        shopId: shop2.id,
        subOrderNumber: 'NW-2026-KLH-8910-S2',
        status: 'PACKED',
        shopSubtotal: secondProd.price,
        deliveryFee: 0.0,
        platformCommission: Math.round(secondProd.price * 0.08 * 100) / 100,
        sellerPayable: Math.round((secondProd.price - secondProd.price * 0.08) * 100) / 100,
        acceptedAt: new Date(),
        packedAt: new Date()
      }
    });

    await prisma.orderItem.create({
      data: {
        sellerOrderId: so2.id,
        productId: secondProd.id,
        variantId: secondProd.variants[0].id,
        title: secondProd.title,
        size: secondProd.variants[0].size,
        color: secondProd.variants[0].color,
        quantity: 1,
        unitPrice: secondProd.price,
        totalPrice: secondProd.price,
        commissionPct: 8.0
      }
    });

    console.log('✅ Seeded active sample multi-seller order');
  }

  console.log('✨ NearWear complete commercial seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
