import React, { useMemo, useState } from 'react';
import { ArrowLeft, Copy, Gift, Minus, Package, Plus, Save, Share2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import Navbar from '../components/Navbar';
import { useShop } from '../context/ShopContext';
import { coupons, packagingOptions } from '../utils/mockData';

const CustomBoxPage = () => {
  const { products, addToCart, saveCustomBox } = useShop();
  const [selectedBox, setSelectedBox] = useState(packagingOptions[1]);
  const [activeCategory, setActiveCategory] = useState('Stationery');
  const [boxItems, setBoxItems] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [savedToken, setSavedToken] = useState('');

  const categories = [...new Set(products.map(item => item.category))];
  const visibleProducts = products.filter(item => item.category === activeCategory);
  const lines = useMemo(() => Object.entries(boxItems).map(([id, qty]) => ({ ...products.find(item => item.id === id), qty })).filter(Boolean), [boxItems, products]);
  const productSubtotal = lines.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subtotal = productSubtotal + (lines.length ? selectedBox.price : 0);
  const coupon = coupons.find(item => item.code.toLowerCase() === couponCode.trim().toLowerCase());
  const discount = coupon && subtotal >= coupon.min_order_value
    ? Math.min(coupon.discount_type === 'flat' ? coupon.discount_value : Math.round(subtotal * coupon.discount_value / 100), coupon.max_discount_value)
    : 0;
  const total = Math.max(0, subtotal - discount);

  const updateLine = (id, delta) => {
    setBoxItems(prev => {
      const nextQty = Math.max(0, (prev[id] || 0) + delta);
      const next = { ...prev };
      if (nextQty === 0) delete next[id];
      else next[id] = nextQty;
      return next;
    });
  };

  const buildBoxPayload = () => ({
    id: `custom-${Date.now()}`,
    itemType: 'custom_box',
    name: `${selectedBox.name} Custom Box`,
    boxType: selectedBox.name,
    category: 'Custom Box',
    price: total,
    stock: 99,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900',
    description: `${lines.length} selected products`,
    items: lines.map(item => ({ id: item.id, name: item.name, qty: item.qty, price: item.price })),
    couponCode: discount ? coupon.code : ''
  });

  const handleSave = async () => {
    if (!lines.length) return;
    const saved = await saveCustomBox(buildBoxPayload());
    setSavedToken(saved.shareToken);
  };

  const handleShare = async () => {
    const summary = `GiftLane custom box: ${selectedBox.name}, ${lines.map(item => `${item.name} x ${item.qty}`).join(', ')}. Total ₹${total}`;
    if (navigator.share) await navigator.share({ title: 'GiftLane custom box', text: summary });
    else {
      await navigator.clipboard.writeText(summary);
      setSavedToken('Copied summary');
    }
  };

  return (
    <div>
      <Navbar />
      <CartDrawer />
      <main className="custom-page">
        <div className="container">
          <Link to="/" className="back-link"><ArrowLeft size={18} /> Back to store</Link>
          <div className="catalogue-hero">
            <div>
              <span className="eyebrow">Create your own box</span>
              <h1>Product Catalogue</h1>
              <p>Choose products by category, add individual items directly to cart, or build a custom gift box and confirm everything on the cart page.</p>
            </div>
            <Link to="/cart" className="btn btn-primary"><ShoppingBag size={18} /> View Final Cart</Link>
          </div>

          <div className="builder-grid">
            <section className="builder-main">
              <div className="builder-section catalogue-section">
                <h2><Gift size={20} /> Choose a category</h2>
                <div className="catalogue-category-grid">
                  {categories.map(category => {
                    const sample = products.find(item => item.category === category);
                    return (
                      <button key={category} className={activeCategory === category ? 'catalogue-category active' : 'catalogue-category'} onClick={() => setActiveCategory(category)}>
                        <img src={sample?.image} alt={category} />
                        <span>{category}</span>
                        <small>{products.filter(item => item.category === category).length} products</small>
                      </button>
                    );
                  })}
                </div>
                <div className="catalogue-title-row">
                  <div>
                    <h2>{activeCategory} Products</h2>
                    <p className="section-note">Product photos, details, price, stock, custom box controls, and direct cart actions.</p>
                  </div>
                </div>
                <div className="custom-catalogue-grid">
                  {visibleProducts.map(product => (
                    <article key={product.id} className="custom-product-card">
                      <img src={product.image} alt={product.name} />
                      <div className="custom-product-body">
                        <small>{product.category}</small>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="product-status-row">
                          <strong>₹{product.price}</strong>
                          <span className={product.stock <= 5 ? 'stock-text low' : 'stock-text'}>{product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}</span>
                        </div>
                        <div className="custom-product-actions">
                          <div className="qty-stepper">
                            <button onClick={() => updateLine(product.id, -1)}><Minus size={14} /></button>
                            <span>{boxItems[product.id] || 0}</span>
                            <button disabled={product.stock <= (boxItems[product.id] || 0)} onClick={() => updateLine(product.id, 1)}><Plus size={14} /></button>
                          </div>
                          <button className="btn btn-outline" disabled={product.stock <= 0} onClick={() => addToCart(product)}>
                            <ShoppingBag size={16} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <aside className="summary-panel">
              <h2><Package size={20} /> Select packaging</h2>
              <div className="side-package-list">
                {packagingOptions.map(option => (
                  <button key={option.id} className={selectedBox.id === option.id ? 'side-package active' : 'side-package'} onClick={() => setSelectedBox(option)}>
                    <span>
                      <strong>{option.name}</strong>
                      <small>{option.description}</small>
                    </span>
                    <b>₹{option.price}</b>
                  </button>
                ))}
              </div>
              <h2>Custom box summary</h2>
              <div className="summary-box-line"><span>{selectedBox.name}</span><strong>₹{selectedBox.price}</strong></div>
              <div className="summary-items">
                {lines.length === 0 ? <p>Your box is empty.</p> : lines.map(item => (
                  <div key={item.id}><span>{item.name} x {item.qty}</span><strong>₹{item.price * item.qty}</strong></div>
                ))}
              </div>
              <div className="coupon-row">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" />
              </div>
              <div className="totals">
                <span>Products</span><strong>₹{productSubtotal}</strong>
                <span>Box price</span><strong>₹{lines.length ? selectedBox.price : 0}</strong>
                <span>Discount</span><strong>-₹{discount}</strong>
                <span className="grand">Final total</span><strong className="grand">₹{total}</strong>
              </div>
              <div className="summary-actions">
                <button className="btn btn-outline" disabled={!lines.length} onClick={handleSave}><Save size={17} /> Save</button>
                <button className="btn btn-outline" disabled={!lines.length} onClick={handleShare}><Share2 size={17} /> Share</button>
              </div>
              {savedToken && <p className="coupon-message"><Copy size={14} /> {savedToken === 'Copied summary' ? savedToken : `Saved with token ${savedToken}`}</p>}
              <button className="btn btn-primary checkout-btn" disabled={!lines.length} onClick={() => addToCart(buildBoxPayload())}>
                <ShoppingBag size={18} /> Add custom box to cart
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomBoxPage;
