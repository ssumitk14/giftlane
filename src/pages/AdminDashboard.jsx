import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Boxes, ClipboardList, FolderTree, LogOut, Package, Plus, Search, Settings, Tags, Truck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { catalogApi, couponApi, inventoryApi, orderApi, settingsApi } from '../services/supabaseApi';
import { categories as seedCategories, coupons as seedCoupons, products as seedProducts, readyMadeKits as seedKits } from '../utils/mockData';

const orderStatuses = ['Pending', 'Confirmed', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled'];
const adminTabs = [
  ['dashboard', 'Dashboard', BarChart3],
  ['products', 'Products', Package],
  ['categories', 'Categories', FolderTree],
  ['kits', 'Ready-Made Kits', Boxes],
  ['coupons', 'Coupons', Tags],
  ['orders', 'Orders', ClipboardList],
  ['inventory', 'Inventory', Truck],
  ['settings', 'Settings', Settings],
  ['customers', 'Customers', Users]
];

const emptyForm = {
  id: '',
  name: '',
  label: '',
  code: '',
  category_id: '',
  type: 'product',
  discount_type: 'percentage',
  price: '',
  stock: '',
  discount_value: '',
  min_order_value: '',
  max_discount_value: '',
  usage_limit: '',
  expiry_date: '',
  image: '',
  description: '',
  is_active: true,
  is_featured: false,
  sort_order: ''
};

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState(seedProducts);
  const [kits, setKits] = useState(seedKits);
  const [categories, setCategories] = useState(seedCategories);
  const [coupons, setCoupons] = useState(seedCoupons);
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    setMessage('');
    try {
      const [categoryRows, productRows, kitRows, couponRows, orderRows, logRows, slotRows] = await Promise.all([
        catalogApi.fetchCategories(undefined, { includeHidden: true }),
        catalogApi.fetchProducts({ includeHidden: true }),
        catalogApi.fetchReadyMadeKits({ includeHidden: true }),
        couponApi.fetchCoupons({ includeHidden: true }),
        orderApi.fetchOrders(),
        inventoryApi.fetchLogs(),
        settingsApi.fetchDeliverySlots()
      ]);
      if (categoryRows.length) setCategories(categoryRows);
      if (productRows.length) setProducts(productRows);
      if (kitRows.length) setKits(kitRows);
      if (couponRows.length) setCoupons(couponRows);
      setOrders(orderRows);
      setLogs(logRows);
      setDeliverySlots(slotRows);
    } catch (err) {
      setMessage(`Using seed fallback: ${err.message}`);
    }
  };

  useEffect(() => { loadAdminData(); }, []);

  const searchableProducts = useMemo(() => products.filter(item => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  const openForm = (defaults = {}) => {
    setForm({ ...emptyForm, ...defaults });
    setFormOpen(true);
  };

  const editProduct = (item) => {
    setActiveTab('products');
    openForm({ id: item.id, name: item.name, category_id: item.categoryId || '', price: item.price, stock: item.stock, image: item.image || '', description: item.description || '', is_active: item.active !== false, is_featured: item.is_featured });
  };

  const editCategory = (item) => {
    setActiveTab('categories');
    openForm({ id: item.id, name: item.name, type: item.type, image: item.image || '', description: item.description || '', is_active: item.is_active !== false });
  };

  const editKit = (item) => {
    setActiveTab('kits');
    openForm({ id: item.id, name: item.name, category_id: item.categoryId || '', price: item.price, stock: item.stock, image: item.image || '', description: item.description || '', is_active: item.active !== false, is_featured: item.is_featured });
  };

  const editCoupon = (item) => {
    setActiveTab('coupons');
    openForm({ id: item.id, code: item.code, discount_type: item.discount_type, discount_value: item.discount_value, min_order_value: item.min_order_value, max_discount_value: item.max_discount_value || '', usage_limit: item.usage_limit || '', expiry_date: item.expiry_date?.slice(0, 10) || '', is_active: item.active });
  };

  const saveForm = async () => {
    try {
      if (activeTab === 'products' || activeTab === 'dashboard') {
        await catalogApi.upsertProduct({
          ...form,
          price: form.price,
          stock: form.stock,
          image_url: form.image,
          stock_quantity: form.stock
        });
      } else if (activeTab === 'categories') {
        await catalogApi.upsertCategory({ ...form, image_url: form.image });
      } else if (activeTab === 'kits') {
        await catalogApi.upsertKit({ ...form, image_url: form.image, stock_quantity: form.stock });
      } else if (activeTab === 'coupons') {
        await couponApi.upsertCoupon(form);
      } else if (activeTab === 'settings') {
        await settingsApi.upsertDeliverySlot(form);
      }
      setFormOpen(false);
      await loadAdminData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await orderApi.updateStatus(id, status);
      await loadAdminData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const hideRecord = async (kind, id) => {
    try {
      if (kind === 'product') await catalogApi.hideProduct(id);
      if (kind === 'category') await catalogApi.hideCategory(id);
      if (kind === 'kit') await catalogApi.hideKit(id);
      if (kind === 'coupon') await couponApi.disableCoupon(id);
      await loadAdminData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const correctStock = async (product) => {
    const value = window.prompt(`New stock for ${product.name}`, product.stock);
    if (value == null) return;
    try {
      await inventoryApi.correctStock(product, Number(value));
      await loadAdminData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const renderToolbar = (title, action = 'Add New') => (
    <header className="admin-header">
      <div>
        <span className="eyebrow">GiftLane Admin</span>
        <h1>{title}</h1>
      </div>
      <div className="admin-actions">
        <label className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" /></label>
        {['dashboard', 'products', 'categories', 'kits', 'coupons', 'settings'].includes(activeTab) && <button className="btn btn-primary" onClick={() => openForm()}><Plus size={18} /> {action}</button>}
      </div>
    </header>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a href="/" className="brand admin-brand"><span className="brand-mark">GL</span><span><strong>GiftLane</strong><small>Supabase admin</small></span></a>
        <nav>
          {adminTabs.map(([id, label, Icon]) => (
            <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
              <Icon size={19} /> {label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={signOut}><LogOut size={19} /> Logout</button>
      </aside>

      <main className="admin-main">
        {message && <p className="admin-message">{message}</p>}

        {activeTab === 'dashboard' && (
          <>
            {renderToolbar('Dashboard', 'Create Product')}
            <section className="metric-grid">
              <div><span>Total products</span><strong>{products.length}</strong></div>
              <div><span>Ready-made kits</span><strong>{kits.length}</strong></div>
              <div><span>Open orders</span><strong>{orders.filter(order => !['Delivered', 'Cancelled'].includes(order.order_status)).length}</strong></div>
              <div><span>Low stock</span><strong>{products.filter(item => item.stock <= 5).length}</strong></div>
            </section>
            <section className="admin-card">
              <h2>Recent orders</h2>
              <AdminTable rows={orders.slice(0, 8).map(order => ({
                id: order.id?.slice(0, 8),
                customer: order.customer_name,
                phone: order.customer_phone,
                status: order.order_status,
                total: `₹${order.total_amount}`
              }))} columns={['id', 'customer', 'phone', 'status', 'total']} />
            </section>
          </>
        )}

        {activeTab === 'products' && (
          <>
            {renderToolbar('Product Management', 'Add Product')}
            <section className="admin-card">
              <AdminTable rows={searchableProducts.map(item => ({
                name: item.name,
                category: item.category,
                price: `₹${item.price}`,
                stock: item.stock,
                status: item.stock <= 0 ? 'Out of stock' : item.stock <= 5 ? 'Low stock' : 'In stock',
                featured: item.is_featured ? 'Yes' : 'No',
                visible: item.active === false ? 'Hidden' : 'Visible',
                action: <span className="inline-actions"><button className="text-button" onClick={() => editProduct(item)}>Edit</button><button className="text-button" onClick={() => correctStock(item)}>Stock</button><button className="text-button danger" onClick={() => hideRecord('product', item.id)}>Hide</button></span>
              }))} columns={['name', 'category', 'price', 'stock', 'status', 'featured', 'visible', 'action']} />
            </section>
          </>
        )}

        {activeTab === 'categories' && (
          <>
            {renderToolbar('Category Management', 'Add Category')}
            <section className="admin-grid">
              {categories.map((category, index) => (
                <article className="admin-card" key={category.id}>
                  <img className="admin-thumb" src={category.image} alt={category.name} />
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <div className="admin-meta"><span>Type: {category.type}</span><span>Sort: {category.sort_order || index + 1}</span><span>{category.is_active === false ? 'Hidden' : 'Visible'}</span></div>
                  <div className="inline-actions"><button className="text-button" onClick={() => editCategory(category)}>Edit</button><button className="text-button danger" onClick={() => hideRecord('category', category.id)}>Hide</button></div>
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === 'kits' && (
          <>
            {renderToolbar('Ready-Made Kit Management', 'Create Kit')}
            <section className="admin-card">
              <AdminTable rows={kits.map(kit => ({
                name: kit.name,
                category: kit.category,
                price: `₹${kit.price}`,
                stock: kit.stock,
                featured: kit.is_featured ? 'Yes' : 'No',
                visible: kit.active === false ? 'Hidden' : 'Visible',
                action: <span className="inline-actions"><button className="text-button" onClick={() => editKit(kit)}>Edit</button><button className="text-button danger" onClick={() => hideRecord('kit', kit.id)}>Hide</button></span>
              }))} columns={['name', 'category', 'price', 'stock', 'featured', 'visible', 'action']} />
            </section>
          </>
        )}

        {activeTab === 'coupons' && (
          <>
            {renderToolbar('Coupon Management', 'Create Coupon')}
            <section className="admin-card">
              <AdminTable rows={coupons.map(coupon => ({
                code: coupon.code,
                type: coupon.discount_type,
                value: coupon.discount_type === 'flat' ? `₹${coupon.discount_value}` : `${coupon.discount_value}%`,
                min_order: `₹${coupon.min_order_value}`,
                max_discount: coupon.max_discount_value ? `₹${coupon.max_discount_value}` : 'No cap',
                usage: `${coupon.used_count || 0}/${coupon.usage_limit || '∞'}`,
                active: coupon.active ? 'Enabled' : 'Disabled',
                action: <span className="inline-actions"><button className="text-button" onClick={() => editCoupon(coupon)}>Edit</button><button className="text-button danger" onClick={() => hideRecord('coupon', coupon.id)}>Disable</button></span>
              }))} columns={['code', 'type', 'value', 'min_order', 'max_discount', 'usage', 'active', 'action']} />
            </section>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {renderToolbar('Order Management')}
            <section className="admin-card">
              <AdminTable rows={orders.map(order => ({
                id: order.id?.slice(0, 8),
                date: new Date(order.created_at).toLocaleDateString(),
                customer: order.customer_name,
                phone: order.customer_phone,
                status: <select value={order.order_status} onChange={e => updateOrderStatus(order.id, e.target.value)}>{orderStatuses.map(status => <option key={status}>{status}</option>)}</select>,
                total: `₹${order.total_amount}`
              }))} columns={['id', 'date', 'customer', 'phone', 'status', 'total']} />
            </section>
          </>
        )}

        {activeTab === 'inventory' && (
          <>
            {renderToolbar('Inventory Management')}
            <section className="admin-card">
              <h2>Stock warnings</h2>
              <AdminTable rows={products.filter(item => item.stock <= 5).map(item => ({ product: item.name, category: item.category, stock: item.stock, website_label: item.stock === 0 ? 'Out of stock' : `Only ${item.stock} left`, checkout: item.stock === 0 ? 'Blocked' : 'Allowed' }))} columns={['product', 'category', 'stock', 'website_label', 'checkout']} />
            </section>
            <section className="admin-card">
              <h2>Inventory logs</h2>
              <AdminTable rows={logs.map(log => ({ id: log.id?.slice(0, 8), product: log.products?.name || log.product_id, change_type: log.change_type, quantity_changed: log.quantity_changed, old_quantity: log.old_quantity, new_quantity: log.new_quantity, remarks: log.remarks }))} columns={['id', 'product', 'change_type', 'quantity_changed', 'old_quantity', 'new_quantity', 'remarks']} />
            </section>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {renderToolbar('Delivery Slots & Settings')}
            <section className="admin-card">
              <AdminTable rows={deliverySlots.map(slot => ({ label: slot.label, sort_order: slot.sort_order, active: slot.is_active ? 'Enabled' : 'Disabled' }))} columns={['label', 'sort_order', 'active']} />
            </section>
          </>
        )}

        {activeTab === 'customers' && (
          <>
            {renderToolbar('Customers')}
            <section className="admin-card">
              <p>Customer profiles are stored in Supabase `profiles`; orders and wishlist are linked by user id.</p>
            </section>
          </>
        )}
      </main>

      {formOpen && <AdminForm activeTab={activeTab} form={form} setForm={setForm} categories={categories} onCancel={() => setFormOpen(false)} onSave={saveForm} />}
    </div>
  );
};

const AdminForm = ({ activeTab, form, setForm, categories, onCancel, onSave }) => (
  <div className="modal-backdrop">
    <div className="admin-modal">
      <h2>{activeTab === 'coupons' ? 'Save Coupon' : activeTab === 'categories' ? 'Save Category' : activeTab === 'kits' ? 'Save Kit' : 'Save Product'}</h2>
      <div className="form-grid">
        {activeTab === 'settings' ? (
          <>
            <input placeholder="Delivery slot label" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
            <input placeholder="Sort order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
          </>
        ) : activeTab === 'coupons' ? (
          <>
            <input placeholder="Coupon code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}><option value="percentage">Percentage</option><option value="flat">Flat</option></select>
            <input placeholder="Discount value" type="number" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} />
            <input placeholder="Minimum order value" type="number" value={form.min_order_value} onChange={e => setForm({ ...form, min_order_value: e.target.value })} />
            <input placeholder="Maximum discount" type="number" value={form.max_discount_value} onChange={e => setForm({ ...form, max_discount_value: e.target.value })} />
            <input placeholder="Usage limit" type="number" value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} />
            <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} />
          </>
        ) : (
          <>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="product">Product category</option><option value="ready_made_kit">Ready-made kit category</option></select>
            {activeTab !== 'categories' && <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}><option value="">Category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select>}
            {activeTab !== 'categories' && <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />}
            {activeTab !== 'categories' && <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />}
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </>
        )}
        <label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active / visible</label>
        {activeTab !== 'categories' && activeTab !== 'coupons' && <label><input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>}
      </div>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={onSave}>Save</button>
      </div>
    </div>
  </div>
);

const AdminTable = ({ rows, columns }) => (
  <div className="admin-table-wrap">
    <table className="admin-table">
      <thead>
        <tr>{columns.map(column => <th key={column}>{column.replaceAll('_', ' ')}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0 && <tr><td colSpan={columns.length}>No records found.</td></tr>}
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map(column => <td key={column}>{row[column]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;
