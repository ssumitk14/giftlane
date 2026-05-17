import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useShop } from '../context/ShopContext';

const inputStyle = { border: '1px solid var(--border)', borderRadius: 8, minHeight: 44, padding: '10px 12px', width: '100%' };

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    couponCode,
    setCouponCode,
    couponMessage,
    applyCoupon,
    customer,
    setCustomer,
    deliverySlots,
    hasStockIssue,
    openWhatsAppCheckout
  } = useShop();
  const [checkoutError, setCheckoutError] = useState('');

  const canCheckout = cartItems.length > 0 && customer.name && customer.phone && customer.address && !hasStockIssue;

  return (
    <div>
      <Navbar />
      <main className="cart-page">
        <div className="container">
          <Link className="back-link" to="/custom-box"><ArrowLeft size={18} /> Continue adding products</Link>
          <div className="cart-page-head">
            <div>
              <span className="eyebrow">Final cart</span>
              <h1>Review and confirm your items</h1>
              <p>Check product quantities, apply coupons, add delivery details, then send the order to WhatsApp.</p>
            </div>
          </div>

          <div className="cart-page-grid">
            <section className="cart-review-list">
              {cartItems.length === 0 ? (
                <div className="empty-cart-page">
                  <ShoppingBag size={42} />
                  <h2>Your cart is empty</h2>
                  <p>Add products from the catalogue or create a custom box.</p>
                  <Link className="btn btn-primary" to="/custom-box">Open Product Catalogue</Link>
                </div>
              ) : (
                cartItems.map(item => (
                  <article className="cart-review-card" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <small>{item.itemType === 'custom_box' ? 'Custom Box' : item.category}</small>
                      <h2>{item.name}</h2>
                      <p>{item.description}</p>
                      {item.itemType === 'custom_box' && item.items?.length > 0 && (
                        <ul>
                          {item.items.map(line => <li key={line.id}>{line.name} x {line.qty}</li>)}
                        </ul>
                      )}
                      {item.stock <= 5 && item.itemType !== 'custom_box' && <span className="stock-text low">Only {item.stock} left</span>}
                    </div>
                    <div className="cart-review-actions">
                      <strong>₹{item.price * item.qty}</strong>
                      <div className="qty-stepper">
                        <button onClick={() => updateQuantity(item.id, item.qty - 1)}><Minus size={14} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, item.qty + 1)}><Plus size={14} /></button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /> Remove</button>
                    </div>
                  </article>
                ))
              )}
            </section>

            <aside className="cart-confirm-panel">
              <h2>Checkout details</h2>
              <div className="cart-form">
                <input style={inputStyle} placeholder="Customer name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                <input style={inputStyle} placeholder="Phone number" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
                <textarea style={{ ...inputStyle, minHeight: 90 }} placeholder="Delivery address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
                <select style={inputStyle} value={customer.deliverySlot} onChange={e => setCustomer({ ...customer, deliverySlot: e.target.value })}>
                  {deliverySlots.map(slot => <option key={slot}>{slot}</option>)}
                </select>
              </div>

              <div className="coupon-row cart-coupon">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" />
                <button className="btn btn-outline" onClick={() => applyCoupon()}>Apply</button>
              </div>
              {couponMessage && <p className="coupon-message">{couponMessage}</p>}

              <div className="totals">
                <span>Subtotal</span><strong>₹{cartSubtotal}</strong>
                <span>Discount</span><strong>-₹{discountAmount}</strong>
                <span>Delivery</span><strong>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</strong>
                <span className="grand">Final total</span><strong className="grand">₹{cartTotal}</strong>
              </div>
              {hasStockIssue && <p className="error-note">Please reduce quantity for out-of-stock items before checkout.</p>}
              {checkoutError && <p className="error-note">{checkoutError}</p>}
              <button className="btn btn-primary checkout-btn" disabled={!canCheckout} onClick={async () => {
                setCheckoutError('');
                try {
                  await openWhatsAppCheckout();
                } catch (err) {
                  setCheckoutError(err.message);
                }
              }}>
                <MessageCircle size={18} /> Confirm on WhatsApp
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
