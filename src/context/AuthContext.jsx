import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, profileApi } from '../services/supabaseApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const loadProfile = async (activeSession) => {
    if (!activeSession?.user) {
      setProfile(null);
      return null;
    }
    try {
      let saved = await profileApi.getProfile(activeSession.user.id);
      if (!saved) {
        saved = await profileApi.upsertProfile({
          id: activeSession.user.id,
          email: activeSession.user.email,
          name: activeSession.user.user_metadata?.name || '',
          phone: activeSession.user.user_metadata?.phone || '',
          address: activeSession.user.user_metadata?.address || ''
        });
      }
      setProfile(saved);
      return saved;
    } catch (err) {
      console.error('Profile load failed:', err);
      setAuthError(err.message);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    authApi.getSession()
      .then(async activeSession => {
        if (!mounted) return;
        setSession(activeSession);
        await loadProfile(activeSession);
      })
      .catch(err => setAuthError(err.message))
      .finally(() => mounted && setLoading(false));

    const { data } = authApi.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      window.setTimeout(() => {
        loadProfile(nextSession);
      }, 0);
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (payload) => {
    setAuthError('');
    const result = await authApi.signUp(payload);
    return result;
  };

  const signIn = async (payload) => {
    setAuthError('');
    const result = await authApi.signIn(payload);
    setSession(result.session);
    await loadProfile(result.session);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    await authApi.signOut();
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!session?.user) throw new Error('Please log in first.');
    const saved = await profileApi.upsertProfile({
      id: session.user.id,
      email: session.user.email,
      ...updates
    });
    setProfile(saved);
    return saved;
  };

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    profile,
    isAdmin: profile?.role === 'admin',
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    updateProfile
  }), [session, profile, loading, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
