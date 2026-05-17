import React, { useMemo, useState } from 'react';
import { ArrowRight, Gift, Heart, MessageCircle, Minus, PackageCheck, Plus, Search, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import Navbar from '../components/Navbar';
import { useShop } from '../context/ShopContext';
import { WHATSAPP_NUMBER } from '../utils/mockData';

const ProductCard = ({ item, onAdd, onWish, wished }) => {
  const [quantity, setQuantity] = useState(1);
  const canAddMore = quantity < item.stock;

  return (
    <article className="product-card">
      <div className="product-media">
        <img src={item.image} alt={item.name} />
        <button className={wished ? 'wish active' : 'wish'} onClick={() => onWish(item)} aria-label={`Wishlist ${item.name}`}><Heart size={18} /></button>
        <span className={item.stock <= 5 ? 'stock-chip low' : 'stock-chip'}>{item.stock <= 0 ? 'Out of stock' : item.stock <= 5 ? `Only ${item.stock} left` : 'In stock'}</span>
      </div>
      <div className="product-body">
        <small>{item.category}</small>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="kit-quantity">
          <span>Quantity</span>
          <div className="qty-stepper">
            <button disabled={quantity <= 1} onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus size={14} /></button>
            <span>{quantity}</span>
            <button disabled={!canAddMore} onClick={() => setQuantity(value => Math.min(item.stock, value + 1))}><Plus size={14} /></button>
          </div>
        </div>
        <div className="product-bottom">
          <strong>₹{item.price}</strong>
          <button className="btn btn-primary" disabled={item.stock <= 0} onClick={() => onAdd(item, quantity)}>
            <ShoppingBag size={16} /> Add
          </button>
        </div>
      </div>
    </article>
  );
};

const Storefront = () => {
  const { addToCart, products, readyMadeKits, categories, wishlist, toggleWishlist, savedBoxes, orders, customer, setCustomer } = useShop();
  const [activeKitCategory, setActiveKitCategory] = useState('Kids Return Gifts');
  const [query, setQuery] = useState('');

  const filteredKits = readyMadeKits.filter(kit => kit.category === activeKitCategory);
  const featured = readyMadeKits.filter(kit => kit.is_featured).slice(0, 4);
  const catalogue = useMemo(() => products.filter(item => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12), [products, query]);
  const kitCategories = [...new Set(readyMadeKits.map(kit => kit.category))];
  const homeCategories = [
    ...categories.filter(category => category.type === 'ready_made_kit').slice(0, 4),
    { id: 'custom', name: 'Custom Box', description: 'Build a box from the catalogue', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900' }
  ];

  return (
    <div>
      <Navbar />
      <CartDrawer />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Ready-made kits and build-your-own boxes</span>
              <h1>GiftLane</h1>
              <p>Shop polished gift kits or create a custom box with stationery, pooja, shringar, and utility products. Checkout happens instantly through WhatsApp.</p>
              <div className="hero-actions">
                <a href="#kits" className="btn btn-primary">Shop Gift Kits <ArrowRight size={18} /></a>
                <Link to="/catalogue" className="btn btn-outline">Create Your Own Box</Link>
              </div>
            </div>
            <div className="hero-panel">
              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000" alt="Gift boxes" />
              <div>
                <strong>Festival offer</strong>
                <span>Use FESTIVE10 on orders above ₹499</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container section-head">
            <div>
              <span className="eyebrow">Featured</span>
              <h2>Popular gift kits</h2>
            </div>
            <Link to="/catalogue">Open product catalogue <ArrowRight size={16} /></Link>
          </div>
          <div className="container product-grid">
            {featured.map(item => <ProductCard key={item.id} item={item} onAdd={addToCart} onWish={toggleWishlist} wished={wishlist.some(w => w.id === item.id)} />)}
          </div>
        </section>

        <section className="section-pad soft-band">
          <div className="container">
            <div className="category-grid">
              {homeCategories.map(category => (
                <a href={category.id === 'custom' ? '/catalogue' : '#kits'} className="category-tile" key={category.id}>
                  <img src={category.image} alt={category.name} />
                  <span>{category.name}</span>
                  <small>{category.description}</small>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="kits" className="section-pad">
          <div className="container section-head">
            <div>
              <span className="eyebrow">Ready-made kits</span>
              <h2>Browse by category</h2>
            </div>
          </div>
          <div className="container tabs">
            {kitCategories.map(category => (
              <button key={category} className={activeKitCategory === category ? 'active' : ''} onClick={() => setActiveKitCategory(category)}>{category}</button>
            ))}
          </div>
          <div className="container product-grid">
            {filteredKits.map(item => <ProductCard key={item.id} item={item} onAdd={addToCart} onWish={toggleWishlist} wished={wishlist.some(w => w.id === item.id)} />)}
          </div>
        </section>

        <section id="catalogue" className="section-pad soft-band">
          <div className="container section-head">
            <div>
              <span className="eyebrow">Catalogue</span>
              <h2>Products for custom boxes</h2>
            </div>
            <label className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search catalogue" /></label>
          </div>
          <div className="container mini-grid">
            {catalogue.map(item => (
              <article className="mini-product" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div><strong>{item.name}</strong><small>{item.category} · ₹{item.price}</small></div>
                <button onClick={() => addToCart(item)}>Add</button>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad">
          <div className="container steps">
            {[
              [Gift, 'Choose', 'Pick a ready-made kit or start a custom box.'],
              [PackageCheck, 'Add', 'Add products, quantities, and coupon codes.'],
              [MessageCircle, 'Checkout', 'Send the full order to WhatsApp.'],
              [Truck, 'Delivery', 'Get delivery in your selected time slot.']
            ].map(([Icon, title, copy]) => (
              <div className="step" key={title}><Icon size={24} /><h3>{title}</h3><p>{copy}</p></div>
            ))}
          </div>
        </section>

        <section className="promo">
          <div className="container promo-inner">
            <div><Sparkles size={30} /><h2>Bulk orders for events, schools, and teams</h2><p>Share quantity, budget, and delivery date. We will confirm availability on WhatsApp.</p></div>
            <a className="btn btn-primary" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I want to enquire about bulk gifting kits.')}`}>Bulk enquiry</a>
          </div>
        </section>

        <section id="wishlist" className="section-pad soft-band">
          <div className="container split-layout">
            <div>
              <span className="eyebrow">Wishlist</span>
              <h2>Saved for later</h2>
              <div className="saved-list">
                {wishlist.length === 0 ? <p>No wishlist items yet.</p> : wishlist.map(item => <button key={item.id} onClick={() => addToCart(item)}>{item.name}<span>Move to cart</span></button>)}
              </div>
            </div>
            <div>
              <span className="eyebrow">Saved custom boxes</span>
              <h2>Shareable boxes</h2>
              <div className="saved-list">
                {savedBoxes.length === 0 ? <p>Saved custom boxes will appear here.</p> : savedBoxes.map(box => <button key={box.id}>{box.name}<span>Token: {box.shareToken}</span></button>)}
              </div>
            </div>
          </div>
        </section>

        <section id="account" className="section-pad">
          <div className="container account-grid">
            <div className="account-card">
              <span className="eyebrow">My Account</span>
              <h2>Customer details</h2>
              <input placeholder="Name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
              <input placeholder="Phone" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
              <textarea placeholder="Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            </div>
            <div className="account-card">
              <span className="eyebrow">Orders</span>
              <h2>Order history and tracking</h2>
              {orders.slice(0, 3).map(order => (
                <div className="order-row" key={order.id}>
                  <div><strong>{order.id.slice(0, 8)}</strong><small>{new Date(order.created_at).toLocaleDateString()} · ₹{order.total_amount}</small></div>
                  <span>{order.order_status}</span>
                </div>
              ))}
              {orders.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Log in and checkout to see order history here.</p>}
            </div>
          </div>
        </section>
      </main>

      <nav className="mobile-nav">
        <a href="#kits"><ShoppingBag size={20} /><span>Kits</span></a>
        <Link to="/catalogue"><Gift size={20} /><span>Catalogue</span></Link>
        <a href="#wishlist"><Heart size={20} /><span>Wishlist</span></a>
        <Link to="/cart"><ShoppingBag size={20} /><span>Cart</span></Link>
      </nav>
    </div>
  );
};

export default Storefront;
