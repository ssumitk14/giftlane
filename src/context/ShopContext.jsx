import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { boxApi, catalogApi, couponApi, orderApi, settingsApi, wishlistApi } from '../services/supabaseApi';
import {
  categories as seedCategories,
  coupons as seedCoupons,
  products as seedProducts,
  readyMadeKits as seedKits,
  WHATSAPP_NUMBER
} from '../utils/mockData';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const discountForCoupon = (coupon, subtotal) => {
  if (!coupon || !coupon.active || subtotal < Number(coupon.min_order_value || 0)) return 0;
  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) return 0;
  if (coupon.usage_limit && Number(coupon.used_count || 0) >= Number(coupon.usage_limit)) return 0;
  const raw = coupon.discount_type === 'flat'
    ? Number(coupon.discount_value || 0)
    : Math.round((subtotal * Number(coupon.discount_value || 0)) / 100);
  return Math.min(raw, Number(coupon.max_discount_value || raw));
};

export const ShopProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const [cartItems, setCartItems] = useState(() => readStorage('giftlane_cart', []));
  const [wishlist, setWishlist] = useState(() => readStorage('giftlane_wishlist', []));
  const [savedBoxes, setSavedBoxes] = useState(() => readStorage('giftlane_saved_boxes', []));
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(() => readStorage('giftlane_customer', { name: '', phone: '', address: '', deliverySlot: 'Evening: 4 PM - 8 PM' }));
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState(seedProducts);
  const [readyMadeKits, setReadyMadeKits] = useState(seedKits);
  const [categories, setCategories] = useState(seedCategories);
  const [deliverySlots, setDeliverySlots] = useState(['Morning: 9 AM - 12 PM', 'Afternoon: 12 PM - 4 PM', 'Evening: 4 PM - 8 PM']);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  const refreshCatalog = async () => {
    setLoading(true);
    setDataError('');
    try {
      const [categoryRows, productRows, kitRows, slotRows] = await Promise.all([
        catalogApi.fetchCategories(),
        catalogApi.fetchProducts(),
        catalogApi.fetchReadyMadeKits(),
        settingsApi.fetchDeliverySlots()
      ]);
      if (categoryRows.length) setCategories(categoryRows);
      if (productRows.length) setProducts(productRows);
      if (kitRows.length) setReadyMadeKits(kitRows);
      if (slotRows.length) setDeliverySlots(slotRows.map(slot => slot.label));
    } catch (err) {
      console.info('Using local GiftLane seed fallback:', err.message);
      setDataError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomerData = async () => {
    if (!user) return;
    try {
      const [savedWishlist, boxes, orderRows] = await Promise.all([
        wishlistApi.fetchWishlist(user.id),
        boxApi.fetchCustomBoxes(user.id),
        orderApi.fetchOrders(user.id)
      ]);
      setWishlist(savedWishlist);
      setSavedBoxes(boxes);
      setOrders(orderRows);
    } catch (err) {
      console.error('Customer data load failed:', err);
      setDataError(err.message);
    }
  };

  useEffect(() => { refreshCatalog(); }, []);

  useEffect(() => {
    if (profile) {
      setCustomer(prev => ({
        ...prev,
        name: profile.name || prev.name,
        phone: profile.phone || prev.phone,
        address: profile.address || prev.address
      }));
    }
    refreshCustomerData();
  }, [user?.id, profile?.id]);

  useEffect(() => writeStorage('giftlane_cart', cartItems), [cartItems]);
  useEffect(() => { if (!user) writeStorage('giftlane_wishlist', wishlist); }, [wishlist, user]);
  useEffect(() => { if (!user) writeStorage('giftlane_saved_boxes', savedBoxes); }, [savedBoxes, user]);
  useEffect(() => writeStorage('giftlane_customer', customer), [customer]);

  const addToCart = (item, quantity = 1) => {
    if ((item.stock ?? 1) <= 0) return false;
    const cartItem = { ...item, itemType: item.itemType || 'product' };
    setCartItems(prev => {
      const existing = prev.find(entry => entry.id === cartItem.id);
      if (existing) {
        return prev.map(entry => entry.id === cartItem.id ? { ...entry, qty: Math.min((entry.qty || 0) + quantity, item.stock || 99) } : entry);
      }
      return [...prev, { ...cartItem, qty: quantity }];
    });
    return true;
  };

  const removeFromCart = (itemId) => setCartItems(prev => prev.filter(item => item.id !== itemId));

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) return removeFromCart(itemId);
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, qty: Math.min(newQty, item.stock || 99) } : item));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage('');
  };

  const toggleWishlist = async (item) => {
    const exists = wishlist.some(entry => entry.id === item.id);
    setWishlist(prev => exists ? prev.filter(entry => entry.id !== item.id) : [...prev, item]);
    if (user) {
      try {
        if (exists) await wishlistApi.remove(user.id, item.id);
        else await wishlistApi.add(user.id, item.id);
      } catch (err) {
        setDataError(err.message);
      }
    }
  };

  const saveCustomBox = async (box) => {
    const fallback = { ...box, id: `box-${Date.now()}`, shareToken: Math.random().toString(36).slice(2, 9), savedAt: new Date().toISOString() };
    if (!user) {
      setSavedBoxes(prev => [fallback, ...prev]);
      return fallback;
    }
    try {
      const saved = await boxApi.saveCustomBox(user.id, box);
      await refreshCustomerData();
      return saved;
    } catch (err) {
      setDataError(err.message);
      setSavedBoxes(prev => [fallback, ...prev]);
      return fallback;
    }
  };

  const applyCoupon = async (code = couponCode) => {
    const normalized = code.trim();
    if (!normalized) {
      setAppliedCoupon(null);
      setCouponMessage('Enter a coupon code.');
      return false;
    }
    try {
      const result = await couponApi.validateCoupon(normalized, cartSubtotal);
      setAppliedCoupon(result.coupon);
      setCouponMessage(result.message);
      return Boolean(result.coupon && result.discount > 0);
    } catch (err) {
      const seed = seedCoupons.find(item => item.code.toLowerCase() === normalized.toLowerCase());
      const discount = discountForCoupon(seed, cartSubtotal);
      setAppliedCoupon(discount > 0 ? seed : null);
      setCouponMessage(seed && discount > 0 ? `${seed.code} applied.` : err.message);
      return discount > 0;
    }
  };

  const cartSubtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.qty || 1)), 0), [cartItems]);
  const discountAmount = useMemo(() => discountForCoupon(appliedCoupon, cartSubtotal), [appliedCoupon, cartSubtotal]);
  const deliveryFee = cartSubtotal >= 699 || cartSubtotal === 0 ? 0 : 40;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  const cartCount = cartItems.reduce((acc, item) => acc + Number(item.qty || 1), 0);
  const hasStockIssue = cartItems.some(item => Number(item.qty || 1) > Number(item.stock || 0));

  const checkoutMessage = () => {
    const lines = cartItems.map((item, index) => {
      if (item.itemType === 'custom_box') {
        const inner = item.items?.map(line => `   - ${line.name} x ${line.qty}`).join('\n') || '';
        return `${index + 1}. Custom Box - ${item.name} - ₹${item.price} x ${item.qty}\n   - Box Type: ${item.boxType}\n${inner}`;
      }
      const orderType = item.itemType === 'ready_made_kit' ? 'Ready-made kit' : 'Product';
      return `${index + 1}. ${item.name} (${orderType}) - ₹${item.price} x ${item.qty}`;
    }).join('\n');

    return `Hello, I want to place an order.\n\nCustomer Details:\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}\nDelivery Slot: ${customer.deliverySlot}\n\nOrder Details:\n${lines}\n\nCoupon Applied: ${appliedCoupon?.code || 'None'}\nSubtotal: ₹${cartSubtotal}\nDiscount: ₹${discountAmount}\nDelivery: ${deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}\nTotal Amount: ₹${cartTotal}\n\nPlease confirm the order.`;
  };

  const checkout = async () => {
    if (hasStockIssue) throw new Error('One or more items are out of stock.');
    const message = checkoutMessage();
    const order = await orderApi.createOrder({
      userId: user?.id,
      customer,
      items: cartItems,
      subtotal: cartSubtotal,
      discountAmount,
      total: cartTotal,
      coupon: appliedCoupon,
      whatsappMessage: message
    });
    clearCart();
    await refreshCatalog();
    await refreshCustomerData();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    return order;
  };

  const openWhatsAppCheckout = async () => {
    try {
      return await checkout();
    } catch (err) {
      setDataError(err.message);
      throw err;
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      readyMadeKits,
      categories,
      deliverySlots,
      loading,
      dataError,
      cartItems,
      cartCount,
      cartSubtotal,
      deliveryFee,
      discountAmount,
      cartTotal,
      couponCode,
      setCouponCode,
      appliedCoupon,
      couponMessage,
      hasStockIssue,
      isCartOpen,
      wishlist,
      savedBoxes,
      orders,
      customer,
      setCustomer,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      saveCustomBox,
      applyCoupon,
      checkout,
      openWhatsAppCheckout,
      refreshCatalog,
      refreshCustomerData,
      toggleCart: () => setIsCartOpen(open => !open),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </ShopContext.Provider>
  );
};
