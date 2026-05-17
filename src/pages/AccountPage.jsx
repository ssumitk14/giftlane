import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LogOut, PackageCheck, Save, UserRound } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const input = { border: '1px solid var(--border)', borderRadius: 8, minHeight: 44, padding: '10px 12px', width: '100%' };

const AccountPage = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { orders, wishlist, savedBoxes } = useShop();
  const [form, setForm] = useState({ name: profile?.name || '', phone: profile?.phone || '', address: profile?.address || '' });
  const [message, setMessage] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  const save = async () => {
    await updateProfile(form);
    setMessage('Profile saved.');
  };

  return (
    <div>
      <Navbar />
      <main className="account-page">
        <div className="container">
          <div className="account-hero">
            <div>
              <span className="eyebrow">My Account</span>
              <h1>Profile, orders, wishlist, and saved boxes</h1>
            </div>
            <button className="btn btn-outline" onClick={signOut}><LogOut size={17} /> Logout</button>
          </div>

          <div className="account-dashboard-grid">
            <section className="account-panel">
              <h2><UserRound size={20} /> Personal details</h2>
              <input style={input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={input} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <textarea style={{ ...input, minHeight: 96 }} placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              {message && <p className="coupon-message">{message}</p>}
              <button className="btn btn-primary" onClick={save}><Save size={17} /> Save details</button>
            </section>

            <section className="account-panel">
              <h2><PackageCheck size={20} /> Snapshot</h2>
              <div className="metric-grid compact">
                <div><span>Orders</span><strong>{orders.length}</strong></div>
                <div><span>Wishlist</span><strong>{wishlist.length}</strong></div>
                <div><span>Saved boxes</span><strong>{savedBoxes.length}</strong></div>
              </div>
              <Link className="btn btn-outline" to="/orders">View order history</Link>
              <Link className="btn btn-outline" to="/wishlist">Open wishlist</Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
