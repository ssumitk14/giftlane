import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Phone, UserRound } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const field = { border: '1px solid var(--border)', borderRadius: 8, minHeight: 44, padding: '10px 12px', width: '100%' };

const AuthPage = () => {
  const { user, signIn, signUp, authError } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/account" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') await signIn({ email: form.email, password: form.password });
      else await signUp(form);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="auth-page">
        <form className="auth-card" onSubmit={submit}>
          <Link to="/" className="back-link"><ArrowLeft size={18} /> Back to store</Link>
          <span className="eyebrow">GiftLane Account</span>
          <h1>{mode === 'login' ? 'Login' : 'Create account'}</h1>
          <p>Save address, wishlist, custom boxes, cart details, and order history.</p>
          {mode === 'signup' && (
            <>
              <label><UserRound size={17} /> <input style={field} placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label><Phone size={17} /> <input style={field} placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
              <textarea style={{ ...field, minHeight: 82 }} placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </>
          )}
          <label><Mail size={17} /> <input required style={field} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
          <label><Lock size={17} /> <input required style={field} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
          {(error || authError) && <p className="error-note">{error || authError}</p>}
          <button className="btn btn-primary checkout-btn" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}</button>
          <button type="button" className="text-button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AuthPage;
