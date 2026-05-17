import React from 'react';
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { deliverySlots } from '../utils/mockData';
import { useShop } from '../context/ShopContext';

const fieldStyle = { width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'white' };

const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
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
    hasStockIssue,
    openWhatsAppCheckout
  } = useShop();

  if (!isCartOpen) return null;

  const canCheckout = cartItems.length > 0 && customer.name && customer.phone && customer.address && !hasStockIssue;

  return (
    <>
      <button className="drawer-backdrop" aria-label="Close cart" onClick={closeCart} />
      <aside className="cart-drawer">
        <header className="drawer-header">
          <h2><ShoppingBag size={20} /> Cart</h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart"><X size={22} /></button>
        </header>

        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={44} />
              <p>Your cart is empty.</p>
              <button className="btn btn-outline" onClick={closeCart}>Continue shopping</button>
            </div>
          ) : (
            cartItems.map(item => (
              <article key={item.id} className="cart-line">
                <img src={item.image} alt={item.name} />
                <div>
                  <div className="line-title">
                    <h3>{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button>
                  </div>
                  <p>{item.itemType === 'custom_box' ? 'Custom box' : item.category}</p>
                  {item.stock <= 5 && item.itemType !== 'custom_box' && <small className="stock-low">Only {item.stock} left</small>}
                  <div className="line-actions">
                    <strong>₹{item.price}</strong>
                    <div className="qty-stepper">
                      <button onClick={() => updateQuantity(item.id, item.qty - 1)}><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, item.qty + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}

          {cartItems.length > 0 && (
            <section className="checkout-form">
              <h3>Checkout details</h3>
              <input style={fieldStyle} placeholder="Customer name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
              <input style={fieldStyle} placeholder="Phone number" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
              <textarea style={{ ...fieldStyle, minHeight: 82 }} placeholder="Delivery address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
              <select style={fieldStyle} value={customer.deliverySlot} onChange={e => setCustomer({ ...customer, deliverySlot: e.target.value })}>
                {deliverySlots.map(slot => <option key={slot}>{slot}</option>)}
              </select>
            </section>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="drawer-footer">
            <div className="coupon-row">
              <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" />
              <button className="btn btn-outline" onClick={() => applyCoupon()}>Apply</button>
            </div>
            {couponMessage && <p className="coupon-message">{couponMessage}</p>}
            <div className="totals">
              <span>Subtotal</span><strong>₹{cartSubtotal}</strong>
              <span>Discount</span><strong>-₹{discountAmount}</strong>
              <span>Delivery</span><strong>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</strong>
              <span className="grand">Total</span><strong className="grand">₹{cartTotal}</strong>
            </div>
            {hasStockIssue && <p className="error-note">One or more items exceed available stock.</p>}
            <button className="btn btn-primary checkout-btn" disabled={!canCheckout} onClick={openWhatsAppCheckout}>
              <MessageCircle size={18} /> Checkout via WhatsApp
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
