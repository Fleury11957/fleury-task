 import { useEffect } from 'react';
 
export default function Landing({ onLogin }) {
 
  // SEO - Mise à jour des balises meta
  useEffect(() => {
    document.title = 'Fleury Task — Gérez vos projets et tâches avec style';
    const setMeta = (name, content, prop = false) => {
      let el = document.querySelector(prop ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); prop ? el.setAttribute('property', name) : el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Fleury Task est une application PWA de gestion de projets et tâches. Organisez votre équipe, planifiez vos tâches et suivez vos projets avec un design professionnel.');
    setMeta('keywords', 'gestion de tâches, gestion de projets, kanban, productivité, PWA, application web');
    setMeta('author', 'Fleury Zoé Dev');
    setMeta('og:title', 'Fleury Task — Gérez vos projets avec style', true);
    setMeta('og:description', 'Application PWA de gestion de projets et tâches. Kanban, calendrier, statistiques.', true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'Fleury Task');
    setMeta('twitter:description', 'Gérez vos projets et tâches avec style');
  }, []);
 
  const features = [
    { icon: 'ti-layout-kanban', title: 'Tableau Kanban', desc: 'Visualisez et organisez vos tâches en colonnes. Déplacez-les facilement entre À faire, En cours et Terminé.', color: '#3b82f6', bg: '#eff6ff' },
    { icon: 'ti-calendar-event', title: 'Calendrier', desc: 'Planifiez vos tâches sur un calendrier mensuel et ne manquez plus aucune échéance importante.', color: '#f59e0b', bg: '#fff8eb' },
    { icon: 'ti-chart-bar', title: 'Statistiques', desc: 'Suivez votre productivité avec des graphiques détaillés et des indicateurs de performance.', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: 'ti-message-circle', title: 'Commentaires', desc: 'Collaborez avec votre équipe directement sur chaque tâche grâce au fil de commentaires.', color: '#1d9e75', bg: '#e8f8f2' },
    { icon: 'ti-paperclip', title: 'Fichiers joints', desc: 'Joignez des fichiers, images et documents directement à vos tâches pour tout centraliser.', color: '#ef4444', bg: '#fff1f1' },
    { icon: 'ti-bell', title: 'Notifications', desc: 'Recevez des alertes en temps réel pour les nouvelles tâches, commentaires et échéances.', color: '#ec4899', bg: '#fdf2f8' },
  ];
 
  const steps = [
    { num: '01', title: 'Créez votre compte', desc: 'Inscription gratuite en 30 secondes. Aucune carte bancaire requise.' },
    { num: '02', title: 'Créez vos projets', desc: 'Organisez votre travail en projets et invitez vos collaborateurs.' },
    { num: '03', title: 'Gérez vos tâches', desc: 'Ajoutez des tâches, assignez-les, fixez des échéances et suivez la progression.' },
  ];
 
  const stats = [
    { value: '100%', label: 'Gratuit', icon: 'ti-heart' },
    { value: 'PWA', label: 'Installable', icon: 'ti-device-mobile' },
    { value: '∞', label: 'Tâches', icon: 'ti-infinity' },
    { value: '2', label: 'Langues', icon: 'ti-world' },
  ];
 
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
 
      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'sticky', top: 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8e8e8',
        zIndex: 100,
        padding: '0 40px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1a2744', letterSpacing: '-0.5px' }}>
          Fleury <span style={{ color: '#1d9e75' }}>Task</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onLogin}
            style={{
              padding: '8px 20px',
              background: 'transparent', color: '#1a2744',
              border: '1px solid #e8e8e8', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1a2744'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}
          >
            Connexion
          </button>
          <button
            onClick={onLogin}
            style={{
              padding: '8px 20px',
              background: '#1a2744', color: 'white',
              border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#243660'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a2744'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Commencer gratuitement →
          </button>
        </div>
      </nav>
 
      {/* ===== HERO ===== */}
      <section style={{
        padding: '80px 40px 60px',
        textAlign: 'center',
        maxWidth: 860, margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#e8f8f2', color: '#0f6e56',
          padding: '6px 16px', borderRadius: 99,
          fontSize: 13, fontWeight: 600, marginBottom: 24,
          border: '1px solid #9fe1cb',
        }}>
          <i className="ti ti-sparkles" style={{ fontSize: 15 }} />
          Application PWA — Fonctionne sur tous vos appareils
        </div>
 
        <h1 style={{
          fontSize: 56, fontWeight: 900, color: '#1a2744',
          letterSpacing: '-2px', lineHeight: 1.1,
          marginBottom: 20,
        }}>
          Gérez vos projets<br />
          <span style={{ color: '#1d9e75' }}>avec style</span>
        </h1>
 
        <p style={{
          fontSize: 18, color: '#737373', lineHeight: 1.7,
          maxWidth: 560, margin: '0 auto 36px',
        }}>
          Fleury Task réunit Kanban, calendrier, statistiques et collaboration
          en une seule application moderne et intuitive.
        </p>
 
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onLogin}
            style={{
              padding: '14px 32px',
              background: '#1a2744', color: 'white',
              border: 'none', borderRadius: 10,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#243660'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,39,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a2744'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <i className="ti ti-rocket" />
            Commencer gratuitement
          </button>
          <button
            onClick={onLogin}
            style={{
              padding: '14px 32px',
              background: 'white', color: '#1a2744',
              border: '1.5px solid #e8e8e8', borderRadius: 10,
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a2744'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <i className="ti ti-eye" />
            Voir la démo
          </button>
        </div>
      </section>
 
      {/* ===== STATS ===== */}
      <section style={{
        background: '#1a2744',
        padding: '40px',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 28, color: '#1d9e75', display: 'block', marginBottom: 10 }} />
              <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ===== FONCTIONNALITÉS ===== */}
      <section style={{ padding: '80px 40px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1d9e75', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            FONCTIONNALITÉS
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#1a2744', letterSpacing: '-1px', marginBottom: 12 }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ fontSize: 16, color: '#737373', maxWidth: 480, margin: '0 auto' }}>
            Des outils puissants pour organiser, collaborer et rester productif.
          </p>
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'white', borderRadius: 16,
                padding: 28, border: '1px solid #e8e8e8',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = f.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: f.bg, marginBottom: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${f.icon}`} style={{ fontSize: 26, color: f.color }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a2744', marginBottom: 10, letterSpacing: '-0.3px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section style={{ background: '#f0f2f5', padding: '80px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1d9e75', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              PROCESSUS
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#1a2744', letterSpacing: '-1px' }}>
              Simple et rapide à démarrer
            </h2>
          </div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 16,
                padding: 28, border: '1px solid #e8e8e8',
                position: 'relative',
              }}>
                <div style={{
                  fontSize: 48, fontWeight: 900,
                  color: '#1d9e75', opacity: 0.15,
                  letterSpacing: '-2px', lineHeight: 1,
                  marginBottom: 16,
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a2744', marginBottom: 10 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: '#737373', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ===== CTA FINAL ===== */}
      <section style={{
        background: '#1a2744',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 40, fontWeight: 900, color: 'white',
            letterSpacing: '-1.5px', marginBottom: 16,
          }}>
            Prêt à être plus productif ?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.6 }}>
            Rejoignez Fleury Task et transformez votre façon de gérer vos projets.
            Gratuit, rapide et efficace.
          </p>
          <button
            onClick={onLogin}
            style={{
              padding: '16px 40px',
              background: '#1d9e75', color: 'white',
              border: 'none', borderRadius: 12,
              fontSize: 17, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0f6e56'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(29,158,117,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1d9e75'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <i className="ti ti-rocket" style={{ fontSize: 20 }} />
            Commencer maintenant — C'est gratuit
          </button>
        </div>
      </section>
 
      {/* ===== FOOTER ===== */}
      <footer style={{
        background: '#0f1729',
        padding: '32px 40px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>
          Fleury <span style={{ color: '#1d9e75' }}>Task</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Fleury Zoé Dev · Tous droits réservés
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="https://github.com/Fleury11957" target="_blank" rel="noreferrer"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <i className="ti ti-brand-github" />
          </a>
          <a href="mailto:fleuryavokpe6@gmail.com"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1d9e75'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <i className="ti ti-mail" />
          </a>
        </div>
      </footer>
    </div>
  );
}
