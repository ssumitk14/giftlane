import { supabase } from '../lib/supabase';

const nowIso = () => new Date().toISOString();
const slugify = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const safeMaybeSingle = async (query) => {
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
};

export const mapProduct = (row) => ({
  id: row.id,
  categoryId: row.category_id,
  name: row.name,
  slug: row.slug,
  sku: row.sku,
  category: row.categories?.name || row.category || 'Catalogue',
  description: row.description || '',
  image: row.image_url || row.image,
  price: Number(row.price || 0),
  stock: Number(row.stock_quantity ?? row.stock ?? 0),
  is_featured: Boolean(row.is_featured),
  active: row.is_active !== false,
  itemType: 'product'
});

export const mapKit = (row) => ({
  id: row.id,
  categoryId: row.category_id,
  name: row.name,
  slug: row.slug,
  category: row.categories?.name || row.category || 'Ready-Made Kits',
  description: row.description || '',
  image: row.image_url || row.image,
  price: Number(row.price || 0),
  stock: Number(row.stock_quantity ?? row.stock ?? 0),
  is_featured: Boolean(row.is_featured),
  active: row.is_active !== false,
  itemType: 'ready_made_kit',
  kitItems: row.ready_made_kit_items || []
});

export const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description || '',
  image: row.image_url || row.image,
  type: row.type,
  is_active: row.is_active !== false,
  sort_order: row.sort_order || 0
});

export const mapCoupon = (row) => ({
  id: row.id,
  code: row.code,
  discount_type: row.discount_type,
  discount_value: Number(row.discount_value || 0),
  min_order_value: Number(row.min_order_value || 0),
  max_discount_value: row.max_discount_value == null ? null : Number(row.max_discount_value),
  usage_limit: row.usage_limit,
  used_count: Number(row.used_count || 0),
  expiry_date: row.expiry_date,
  active: row.is_active !== false
});

export const authApi = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async signUp({ email, password, name, phone, address }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, address } }
    });
    if (error) throw error;
    return data;
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

export const profileApi = {
  async getProfile(userId) {
    if (!userId) return null;
    return safeMaybeSingle(supabase.from('profiles').select('*').eq('id', userId));
  },

  async upsertProfile(profile) {
    const payload = {
      id: profile.id,
      email: profile.email || null,
      name: profile.name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      updated_at: nowIso()
    };
    if (profile.role) payload.role = profile.role;
    const { data, error } = await supabase.from('profiles').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }
};

export const catalogApi = {
  async fetchCategories(type, { includeHidden = false } = {}) {
    let query = supabase.from('categories').select('*').order('sort_order');
    if (!includeHidden) query = query.eq('is_active', true);
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapCategory);
  },

  async fetchProducts({ includeHidden = false } = {}) {
    let query = supabase.from('products').select('*, categories(name, slug)').order('created_at', { ascending: false });
    if (!includeHidden) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapProduct);
  },

  async fetchReadyMadeKits({ includeHidden = false } = {}) {
    let query = supabase
      .from('ready_made_kits')
      .select('*, categories(name, slug), ready_made_kit_items(id, product_id, quantity, products(name, price, image_url))')
      .order('created_at', { ascending: false });
    if (!includeHidden) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapKit);
  },

  async upsertCategory(category) {
    const payload = {
      id: category.id || undefined,
      name: category.name,
      slug: category.slug || slugify(category.name),
      description: category.description || '',
      image_url: category.image_url || category.image || '',
      type: category.type || 'product',
      is_active: category.is_active !== false,
      sort_order: Number(category.sort_order || 0),
      updated_at: nowIso()
    };
    const { data, error } = await supabase.from('categories').upsert(payload).select().single();
    if (error) throw error;
    return mapCategory(data);
  },

  async upsertProduct(product) {
    const payload = {
      id: product.id || undefined,
      category_id: product.category_id || product.categoryId || null,
      name: product.name,
      slug: product.slug || slugify(product.name),
      sku: product.sku || null,
      description: product.description || '',
      image_url: product.image_url || product.image || '',
      price: Number(product.price || 0),
      stock_quantity: Number(product.stock_quantity ?? product.stock ?? 0),
      is_active: product.is_active !== false && product.active !== false,
      is_featured: Boolean(product.is_featured),
      updated_at: nowIso()
    };
    const { data, error } = await supabase.from('products').upsert(payload).select('*, categories(name, slug)').single();
    if (error) throw error;
    return mapProduct(data);
  },

  async upsertKit(kit) {
    const payload = {
      id: kit.id || undefined,
      category_id: kit.category_id || kit.categoryId || null,
      name: kit.name,
      slug: kit.slug || slugify(kit.name),
      description: kit.description || '',
      image_url: kit.image_url || kit.image || '',
      price: Number(kit.price || 0),
      stock_quantity: Number(kit.stock_quantity ?? kit.stock ?? 0),
      is_active: kit.is_active !== false && kit.active !== false,
      is_featured: Boolean(kit.is_featured),
      updated_at: nowIso()
    };
    const { data, error } = await supabase.from('ready_made_kits').upsert(payload).select('*, categories(name, slug)').single();
    if (error) throw error;
    return mapKit(data);
  },

  async hideProduct(id) {
    const { error } = await supabase.from('products').update({ is_active: false, updated_at: nowIso() }).eq('id', id);
    if (error) throw error;
  },

  async hideCategory(id) {
    const { error } = await supabase.from('categories').update({ is_active: false, updated_at: nowIso() }).eq('id', id);
    if (error) throw error;
  },

  async hideKit(id) {
    const { error } = await supabase.from('ready_made_kits').update({ is_active: false, updated_at: nowIso() }).eq('id', id);
    if (error) throw error;
  }
};

export const couponApi = {
  async fetchCoupons({ includeHidden = false } = {}) {
    let query = supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (!includeHidden) query = query.eq('is_active', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapCoupon);
  },

  async validateCoupon(code, subtotal) {
    const coupon = await safeMaybeSingle(supabase.from('coupons').select('*').ilike('code', code.trim()).eq('is_active', true));
    if (!coupon) return { coupon: null, discount: 0, message: 'Coupon not found or inactive.' };
    const mapped = mapCoupon(coupon);
    if (mapped.expiry_date && new Date(mapped.expiry_date) < new Date()) return { coupon: null, discount: 0, message: 'Coupon has expired.' };
    if (mapped.usage_limit && mapped.used_count >= mapped.usage_limit) return { coupon: null, discount: 0, message: 'Coupon usage limit reached.' };
    if (subtotal < mapped.min_order_value) return { coupon: null, discount: 0, message: `Minimum order value is ₹${mapped.min_order_value}.` };
    const raw = mapped.discount_type === 'flat' ? mapped.discount_value : Math.round((subtotal * mapped.discount_value) / 100);
    const discount = Math.min(raw, mapped.max_discount_value || raw);
    return { coupon: mapped, discount, message: `${mapped.code} applied.` };
  },

  async upsertCoupon(coupon) {
    const payload = {
      id: coupon.id || undefined,
      code: coupon.code.toUpperCase(),
      discount_type: coupon.discount_type || 'percentage',
      discount_value: Number(coupon.discount_value || 0),
      min_order_value: Number(coupon.min_order_value || 0),
      max_discount_value: coupon.max_discount_value === '' ? null : Number(coupon.max_discount_value || 0),
      usage_limit: coupon.usage_limit === '' ? null : Number(coupon.usage_limit || 0),
      expiry_date: coupon.expiry_date || null,
      is_active: coupon.is_active !== false,
      updated_at: nowIso()
    };
    const { data, error } = await supabase.from('coupons').upsert(payload).select().single();
    if (error) throw error;
    return mapCoupon(data);
  },

  async disableCoupon(id) {
    const { error } = await supabase.from('coupons').update({ is_active: false, updated_at: nowIso() }).eq('id', id);
    if (error) throw error;
  }
};

export const boxApi = {
  async fetchCustomBoxes(userId) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('custom_boxes')
      .select('*, custom_box_items(id, product_id, quantity, price_at_time, products(name, image_url))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveCustomBox(userId, box) {
    const token = box.shareToken || Math.random().toString(36).slice(2, 10);
    const { data: saved, error } = await supabase.from('custom_boxes').insert({
      user_id: userId,
      box_name: box.name,
      box_type: box.boxType,
      box_price: Number(box.boxPrice || 0),
      total_price: Number(box.price || 0),
      share_token: token
    }).select().single();
    if (error) throw error;
    const items = (box.items || []).map(item => ({
      custom_box_id: saved.id,
      product_id: item.id,
      quantity: item.qty,
      price_at_time: item.price
    }));
    if (items.length) {
      const { error: itemsError } = await supabase.from('custom_box_items').insert(items);
      if (itemsError) throw itemsError;
    }
    return { ...saved, shareToken: token };
  },

  async getSharedBox(token) {
    return safeMaybeSingle(
      supabase
        .from('custom_boxes')
        .select('*, custom_box_items(id, product_id, quantity, price_at_time, products(name, image_url, price))')
        .eq('share_token', token)
    );
  }
};

export const wishlistApi = {
  async fetchWishlist(userId) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('wishlist')
      .select('id, product_id, products(*, categories(name, slug))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(row => mapProduct(row.products));
  },

  async add(userId, productId) {
    const { error } = await supabase.from('wishlist').upsert({ user_id: userId, product_id: productId });
    if (error) throw error;
  },

  async remove(userId, productId) {
    const { error } = await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId);
    if (error) throw error;
  }
};

export const orderApi = {
  async fetchOrders(userId) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createOrder({ userId, customer, items, subtotal, discountAmount, total, coupon, whatsappMessage }) {
    const rpcItems = items.map(item => ({
      item_type: item.itemType || 'product',
      item_id: item.itemType === 'custom_box' ? null : item.id,
      item_name: item.name,
      quantity: Number(item.qty || 1),
      price_at_time: Number(item.price || 0)
    }));

    const { data: orderId, error } = await supabase.rpc('create_checkout_order', {
      p_user_id: userId || null,
      p_customer_name: customer.name,
      p_customer_phone: customer.phone,
      p_customer_address: customer.address,
      p_delivery_slot: customer.deliverySlot,
      p_subtotal: subtotal,
      p_discount_amount: discountAmount,
      p_total_amount: total,
      p_coupon_id: coupon?.id || null,
      p_coupon_code: coupon?.code || null,
      p_whatsapp_message: whatsappMessage,
      p_items: rpcItems
    });
    if (error) throw error;
    return { id: orderId };
  },

  async reserveInventory(items) {
    for (const item of items) {
      if (item.itemType === 'custom_box') continue;
      const table = item.itemType === 'ready_made_kit' ? 'ready_made_kits' : 'products';
      const { error } = await supabase.rpc('reserve_checkout_inventory', {
        item_table: table,
        item_uuid: item.id,
        item_quantity: Number(item.qty || 1)
      });
      if (error) throw error;
    }
  },

  async updateStatus(orderId, status) {
    const { error } = await supabase.from('orders').update({ order_status: status, updated_at: nowIso() }).eq('id', orderId);
    if (error) throw error;
  }
};

export const inventoryApi = {
  async fetchLogs() {
    const { data, error } = await supabase
      .from('inventory_logs')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async correctStock(product, nextStock, remarks = 'Manual stock correction') {
    const oldStock = Number(product.stock || 0);
    const newStock = Number(nextStock || 0);
    const { error } = await supabase.from('products').update({ stock_quantity: newStock, updated_at: nowIso() }).eq('id', product.id);
    if (error) throw error;
    const { error: logError } = await supabase.from('inventory_logs').insert({
      product_id: product.id,
      change_type: 'manual_update',
      quantity_changed: newStock - oldStock,
      old_quantity: oldStock,
      new_quantity: newStock,
      remarks
    });
    if (logError) throw logError;
  }
};

export const settingsApi = {
  async fetchDeliverySlots() {
    const { data, error } = await supabase
      .from('delivery_slots')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  },

  async upsertDeliverySlot(slot) {
    const { data, error } = await supabase.from('delivery_slots').upsert({
      id: slot.id || undefined,
      label: slot.label,
      start_time: slot.start_time || null,
      end_time: slot.end_time || null,
      is_active: slot.is_active !== false,
      sort_order: Number(slot.sort_order || 0),
      updated_at: nowIso()
    }).select().single();
    if (error) throw error;
    return data;
  }
};
