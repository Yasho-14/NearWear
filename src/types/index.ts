export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  customerProfile?: {
    preferredArea?: string;
    savedMeasurements?: string;
  };
  sellerProfile?: {
    id: string;
    businessType: string;
    panNumber?: string;
    gstin?: string;
    shops: Shop[];
  };
  addresses?: Address[];
}

export interface Address {
  id: string;
  title: string;
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Shop {
  id: string;
  sellerProfileId?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logoUrl: string;
  bannerUrl: string;
  phone: string;
  email: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  streetAddress: string;
  area: string;
  city: string;
  pincode: string;
  deliveryRadiusKm: number;
  minOrderValue: number;
  baseDeliveryFee: number;
  freeDeliveryAbove: number;
  allowsStorePickup: boolean;
  allowsHomeDelivery: boolean;
  openingHours: string;
  products?: Product[];
  _count?: {
    products: number;
    reviews: number;
  };
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex?: string;
  sku: string;
  price?: number;
  inventory?: {
    totalQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  shopId: string;
  title: string;
  slug: string;
  description: string;
  gender: 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX';
  fabric?: string;
  brand?: string;
  price: number;
  mrp: number;
  discountPct: number;
  isFeatured: boolean;
  isAvailable: boolean;
  tags: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  shop: Shop;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  gender: string;
  orderIndex: number;
  _count?: { products: number };
}

export interface CartItem {
  id: string; // client uuid
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  fitFeedback: 'RUNS_SMALL' | 'TRUE_TO_SIZE' | 'RUNS_LARGE';
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface OrderItem {
  id: string;
  title: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    images?: ProductImage[];
  };
}

export interface SellerOrder {
  id: string;
  subOrderNumber: string;
  status: string;
  shopSubtotal: number;
  deliveryFee: number;
  platformCommission: number;
  sellerPayable: number;
  acceptedAt?: string;
  packedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  shop: {
    id: string;
    name: string;
    area: string;
    phone: string;
  };
  items: OrderItem[];
  order?: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryType: string;
    deliveryAddress?: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  deliveryType: string;
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  subtotalAmount: number;
  deliveryFeeTotal: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  sellerOrders: SellerOrder[];
}
