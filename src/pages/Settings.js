import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
 
export default function Settings({ session }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const dark = theme === 'dark';
  const [fullName, setFullName] = useState(session.user.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
 
  const initials = (fullName || session.user.email || 'U').charAt(0).toUpperCase();
 
  async function saveProfile() {
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
 
  const SectionTitle = ({ icon, label }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: 16,
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 18, color: '#1d9e75' }} />
      <h2 style={{
        fontSize: 15, fontWeight: 700,
        color: dark ? '#f0f0f0' : '#1a2744',
        letterSpacing: '-0.3px',
      }}>
        {label}
      </h2>
    </div>
  );
 
  const Row = ({ label, desc, children }) => (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 16,
      padding: '14px 0',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: dark ? '#e5e5e5' : '#1a2744' }}>
          {label}
        </div>
        {desc && (
          <div style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : '#a3a3a3', marginTop: 2 }}>
            {desc}
          </div>
        )}
      </div>
      {children}
    </div>
  );
 
  const Toggle = ({ active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: active ? '#1d9e75' : (dark ? 'rgba(255,255,255,0.12)' : '#e8e8e8'),
        border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2,
        left: active ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
 
  return (
    <div className="ft-page fade-up">
 
      {/* HEADER */}
      <div className="ft-page-header" style={{ textAlign: 'left' }}>
        <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>Compte</div>
        <h1 className="ft-page-title" style={{ textAlign: 'left' }}>{t.settings}</h1>
        <p className="ft-page-subtitle">Gérez votre profil et vos préférences</p>
      </div>
 
      <div style={{ maxWidth: 640 }}>
 
        {/* PROFIL */}
        <div className="ft-card" style={{ padding: 24, marginBottom: 16 }}>
          <SectionTitle icon="ti-user-circle" label={t.profile} />
 
          {/* Avatar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 0', marginBottom: 8,
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#1a2744',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#1d9e75',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: dark ? '#f0f0f0' : '#1a2744' }}>
                {fullName || 'Utilisateur'}
              </div>
              <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : '#a3a3a3', marginTop: 2 }}>
                {session.user.email}
              </div>
            </div>
          </div>
 
          {/* Nom */}
          <div style={{ paddingTop: 16 }}>
            <label style={{
              fontSize: 12, fontWeight: 600,
              color: dark ? 'rgba(255,255,255,0.45)' : '#737373',
              display: 'block', marginBottom: 8,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Nom complet
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="ft-input"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Votre nom complet"
              />
              <button
                className={`ft-btn ${saved ? 'ft-btn-green' : 'ft-btn-navy'}`}
                onClick={saveProfile}
                disabled={saving}
                style={{ whiteSpace: 'nowrap' }}
              >
                {saved
                  ? <><i className="ti ti-check" /> Sauvegardé</>
                  : saving
                    ? 'Sauvegarde...'
                    : <><i className="ti ti-device-floppy" /> {t.save}</>
                }
              </button>
            </div>
          </div>
        </div>
 
        {/* APPARENCE */}
        <div className="ft-card" style={{ padding: 24, marginBottom: 16 }}>
          <SectionTitle icon="ti-palette" label="Apparence" />
 
          <Row
            label={t.darkMode}
            desc={dark ? 'Mode sombre activé' : 'Mode clair activé'}
          >
            <Toggle active={dark} onClick={toggleTheme} />
          </Row>
 
          <Row
            label={t.language}
            desc={lang === 'fr' ? 'Interface en Français' : 'Interface in English'}
          >
            <button
              className="ft-btn ft-btn-ghost"
              onClick={toggleLang}
              style={{ padding: '7px 14px', fontSize: 13 }}
            >
              <i className="ti ti-world" style={{ fontSize: 16 }} />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
          </Row>
        </div>
 
        {/* COMPTE */}
        <div className="ft-card" style={{ padding: 24, marginBottom: 16 }}>
          <SectionTitle icon="ti-shield" label="Sécurité" />
 
          <Row label="Adresse email" desc="Email de connexion">
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: dark ? 'rgba(255,255,255,0.4)' : '#a3a3a3',
              background: dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
              padding: '5px 10px', borderRadius: 6,
            }}>
              {session.user.email}
            </span>
          </Row>
 
          <Row label="Mot de passe" desc="Dernière modification inconnue">
            <button className="ft-btn ft-btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}>
              <i className="ti ti-lock" style={{ fontSize: 16 }} />
              Modifier
            </button>
          </Row>
        </div>
 
        {/* DÉCONNEXION */}
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            width: '100%', padding: '13px 20px',
            background: dark ? 'rgba(239,68,68,0.08)' : '#fff1f1',
            border: `1px solid ${dark ? 'rgba(239,68,68,0.15)' : '#fecaca'}`,
            borderRadius: 12, cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: '#ef4444',
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.14)' : '#fee2e2';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.08)' : '#fff1f1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: 18 }} />
          {t.logout}
        </button>
      </div>
    </div>
  );
}