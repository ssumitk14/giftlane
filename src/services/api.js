import { supabase } from '../lib/supabase';

// --- Products API ---

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// --- Coupons API ---

export const fetchCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addCoupon = async (coupon) => {
  const { data, error } = await supabase
    .from('coupons')
    .insert([coupon])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateCoupon = async (id, updates) => {
  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteCoupon = async (id) => {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
