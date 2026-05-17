import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClipboardList, PackageCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const statuses = ['Pending', 'Confirmed', 'Packed', 'Out for delivery', 'Delivered'];

const OrdersPage = () => {
  const { user } = useAuth();
  const { orders } = useShop();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div>
      <Navbar />
      <main className="catalogue-page">
        <div className="container">
          <div className="catalogue-hero">
            <div>
              <span className="eyebrow">My Orders</span>
              <h1>Order history and tracking</h1>
              <p>Track your WhatsApp checkout orders from pending to delivered.</p>
            </div>
            <Link className="btn btn-primary" to="/catalogue">Shop again</Link>
          </div>

          {orders.length === 0 ? (
            <section className="empty-cart-page"><ClipboardList size={42} /><h2>No orders yet</h2><p>Your orders will appear here after WhatsApp checkout.</p></section>
          ) : (
            <section className="orders-list">
              {orders.map(order => {
                const current = statuses.indexOf(order.order_status);
                return (
                  <article className="order-card" key={order.id}>
                    <div>
                      <small>{new Date(order.created_at).toLocaleString()}</small>
                      <h2>Order #{order.id.slice(0, 8)}</h2>
                      <p>{order.order_items?.map(item => `${item.item_name} x ${item.quantity}`).join(', ')}</p>
                    </div>
                    <strong>₹{order.total_amount}</strong>
                    <div className="tracking-row">
                      {statuses.map((status, index) => <span key={status} className={index <= current ? 'done' : ''}><PackageCheck size={14} /> {status}</span>)}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
