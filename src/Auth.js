
import { useState } from 'react';
import { supabase } from './lib/supabase';
 
export default function Auth() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 
  const reset = () => { setError(''); setSuccess(''); };
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email ou mot de passe incorrect.');
    setLoading(false);
  };
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); reset();
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres.');
      setLoading(false); return;
    }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    if (error) setError(error.message);
    else {
      setSuccess('Compte cree ! Verifiez votre email pour confirmer.');
      setEmail(''); setPassword(''); setFullName('');
    }
    setLoading(false);
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
 
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60,
            background: '#1a2744',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(26,39,68,0.15)',
          }}>
            <svg width="30" height="30" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#1a2744', letterSpacing: '-0.5px' }}>
            Fleury <span style={{ color: '#1d9e75' }}>Task</span>
          </div>
          <div style={{ fontSize: 14, color: '#737373', marginTop: 6 }}>
            Gerez vos projets et taches avec style
          </div>
        </div>
 
        {/* Carte */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          border: '1px solid #e8e8e8',
          padding: '32px 28px',
          boxShadow: '0 4px 32px rgba(26,39,68,0.07)',
        }}>
 
          {/* Onglets */}
          <div style={{
            display: 'flex',
            background: '#f5f5f5',
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
          }}>
            {[
              { id: 'login', label: 'Connexion' },
              { id: 'register', label: 'Inscription' },
            ].map(item => (
              <button key={item.id}
                onClick={() => { setTab(item.id); reset(); }}
                style={{
                  flex: 1, padding: '10px 0',
                  borderRadius: 9, border: 'none',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  background: tab === item.id ? '#1a2744' : 'transparent',
                  color: tab === item.id ? 'white' : '#737373',
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
 
          {/* Erreur */}
          {error && (
            <div style={{
              background: '#fff1f1', border: '1px solid #fecaca',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: '#dc2626', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {error}
            </div>
          )}
 
          {/* Succes */}
          {success && (
            <div style={{
              background: '#e8f8f2', border: '1px solid #9fe1cb',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: '#0f6e56', marginBottom: 20,
            }}>
              {success}
            </div>
          )}
 
          {/* LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#737373', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Adresse email
                </label>
                <input
                  className="ft-input"
                  type="email" value={email} required
                  placeholder="vous@exemple.com"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#737373', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Mot de passe
                </label>
                <input
                  className="ft-input"
                  type="password" value={password} required
                  placeholder="Min. 6 caracteres"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 14,
                background: '#1a2744', color: 'white',
                border: 'none', borderRadius: 11,
                fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          )}
 
          {/* INSCRIPTION */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#737373', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Nom complet
                </label>
                <input
                  className="ft-input"
                  type="text" value={fullName} required
                  placeholder="Jean Dupont"
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#737373', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Adresse email
                </label>
                <input
                  className="ft-input"
                  type="email" value={email} required
                  placeholder="vous@exemple.com"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#737373', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Mot de passe
                </label>
                <input
                  className="ft-input"
                  type="password" value={password} required
                  placeholder="Min. 6 caracteres"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 14,
                background: '#1d9e75', color: 'white',
                border: 'none', borderRadius: 11,
                fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Creation...' : 'Creer mon compte'}
              </button>
            </form>
          )}
        </div>
 
        <div style={{ textAlign: 'center', color: '#a3a3a3', fontSize: 12, marginTop: 24 }}>
          Fleury Task &copy; {new Date().getFullYear()} &mdash; Tous droits reserves
        </div>
      </div>
    </div>
  );
}