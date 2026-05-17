import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { signIn, isAdmin, loading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  const handleLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await signIn({ email, password });
      if (!result.session) throw new Error('Unable to start admin session.');
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <span className="brand-mark">GL</span>
        <span className="eyebrow">Admin Portal</span>
        <h1>GiftLane Admin</h1>
        <p>Use a Supabase user whose profile role is set to admin.</p>
        <label><Mail size={17} /><input required type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label><Lock size={17} /><input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        {(error || authError) && <p className="error-note">{error || authError}</p>}
        <button className="btn btn-primary checkout-btn" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
