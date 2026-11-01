import { Product, Shop, Category, Order, SellerOrder, User } from '../types/index.ts';

const API_BASE = '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('nearwear_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Authentication
  async login(email: string, password: string):Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: { email: string; password: string; name: string; phone?: string; role?: string; businessName?: string; area?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async switchDemo(targetRole: 'CUSTOMER' | 'SELLER' | 'ADMIN'): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRole })
    });
    if (!res.ok) throw new Error('Failed to switch demo role');
    return res.json();
  },

  // Shops
  async getShops(params: { area?: string; category?: string; search?: string; isFeatured?: boolean } = {}): Promise<Shop[]> {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All Kolhapur') query.append('area', params.area);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.isFeatured) query.append('isFeatured', 'true');

    const res = await fetch(`${API_BASE}/shops?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch shops');
    return res.json();
  },

  async getShop(id: string): Promise<Shop> {
    const res = await fetch(`${API_BASE}/shops/${id}`);
    if (!res.ok) throw new Error('Failed to fetch shop');
    return res.json();
  },

  // Products
  async getProducts(params: {
    search?: string;
    category?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    area?: string;
    shopId?: string;
    isFeatured?: boolean;
    sort?: string;
  } = {}): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.gender && params.gender !== 'ALL') query.append('gender', params.gender);
    if (params.minPrice) query.append('minPrice', String(params.minPrice));
    if (params.maxPrice) query.append('maxPrice', String(params.maxPrice));
    if (params.area && params.area !== 'All Kolhapur') query.append('area', params.area);
    if (params.shopId) query.append('shopId', params.shopId);
    if (params.isFeatured) query.append('isFeatured', 'true');
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/products/meta/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createProduct(data: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  // Orders & Checkout
  async checkout(payload: {
    items: { productId: string; variantId: string; quantity: number }[];
    deliveryType: 'HOME_DELIVERY' | 'STORE_PICKUP';
    deliveryAddress?: string;
    customerPhone: string;
    customerName: string;
    couponCode?: string;
    paymentMethod: 'COD' | 'RAZORPAY';
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    return res.json();
  },

  async getCustomerOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/customer`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch customer orders');
    return res.json();
  },

  async getSellerOrders(): Promise<SellerOrder[]> {
    const res = await fetch(`${API_BASE}/orders/seller`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch seller orders');
    return res.json();
  },

  async updateSellerOrderStatus(orderId: string, status: string, rejectionReason?: string): Promise<SellerOrder> {
    const res = await fetch(`${API_BASE}/orders/seller/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, rejectionReason })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }
    return res.json();
  },

  // Admin
  async getAdminOverview(): Promise<{
    metrics: {
      totalUsers: number;
      totalSellers: number;
      totalShops: number;
      approvedShops: number;
      pendingShops: number;
      totalProducts: number;
      totalOrders: number;
      gmv: number;
      platformCommissionEarned: number;
    };
    recentShops: Shop[];
    recentOrders: Order[];
  }> {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin overview');
    return res.json();
  },

  async updateShopStatus(shopId: string, status: string, rejectionReason?: string): Promise<Shop> {
    const res = await fetch(`${API_BASE}/admin/shops/${shopId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, rejectionReason })
    });
    if (!res.ok) throw new Error('Failed to update shop status');
    return res.json();
  }
};
