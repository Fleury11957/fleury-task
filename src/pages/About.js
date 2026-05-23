import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
 
export default function About() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const dark = theme === 'dark';
 
  const skills = [
    { name: 'React',       icon: 'ti-brand-react',      color: '#61dafb', bg: '#e8f8fd' },
    { name: 'JavaScript',  icon: 'ti-brand-javascript',  color: '#f7df1e', bg: '#fefce8' },
    { name: 'HTML',        icon: 'ti-brand-html5',       color: '#e34f26', bg: '#fff1ee' },
    { name: 'CSS',         icon: 'ti-brand-css3',        color: '#1572b6', bg: '#eff6ff' },
    { name: 'Tailwind',    icon: 'ti-brand-tailwind',    color: '#38bdf8', bg: '#f0f9ff' },
    { name: 'Node.js',     icon: 'ti-brand-nodejs',      color: '#339933', bg: '#f0fdf4' },
    { name: 'Supabase',    icon: 'ti-database',          color: '#1d9e75', bg: '#e8f8f2' },
    { name: 'Git',         icon: 'ti-brand-git',         color: '#f05032', bg: '#fff1ee' },
  ];
 
  const projects = [
    {
      name: 'Fleury Task',
      desc: lang === 'fr'
        ? 'Application PWA de gestion de projets et taches - React, Supabase, Tailwind'
        : 'PWA project and task management app - React, Supabase, Tailwind',
      icon: 'ti-layout-dashboard',
      color: '#1d9e75',
      bg: '#e8f8f2',
      link: null,
    },
  ];
  
 
  const socials = [
    {
      name: 'GitHub',
      icon: 'ti-brand-github',
      handle: '@Fleury11957',
      link: 'https://github.com/Fleury11957',
      color: dark ? '#e5e5e5' : '#1a2744',
      bg: dark ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
    },
    {
      name: 'Email',
      icon: 'ti-mail',
      handle: 'fleuryavokpe6@gmail.com',
      link: 'mailto:fleuryavokpe6@gmail.com',
      color: '#ef4444',
      bg: '#fff1f1',
    },
  ];
 
  const quote = lang === 'fr'
    ? '"Le code est une langue que tout le monde peut apprendre — je suis là pour le prouver, une ligne à la fois."'
    : '"Code is a language anyone can learn — I\'m here to prove it, one line at a time."';
 
  return (
    <div className="ft-page fade-up">
 
      {/* HEADER */}
      <div className="ft-page-header" style={{ textAlign: 'left' }}>
        <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>
          {lang === 'fr' ? 'Développeur' : 'Developer'}
        </div>
        <h1 className="ft-page-title" style={{ textAlign: 'left' }}>
          {lang === 'fr' ? 'À propos' : 'About'}
        </h1>
        <p className="ft-page-subtitle">
          {lang === 'fr' ? 'La personne derrière Fleury Task' : 'The person behind Fleury Task'}
        </p>
      </div>
 
      {/* CARTE PROFIL PRINCIPALE */}
      <div className="ft-card" style={{
        padding: 0, marginBottom: 20, overflow: 'hidden',
      }}>
        {/* Bannière navy */}
        <div style={{
          height: 100,
          background: 'linear-gradient(135deg, #1a2744 0%, #243660 50%, #1d9e75 100%)',
          position: 'relative',
        }}>
          {/* Motif décoratif */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(29,158,117,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(59,130,246,0.2) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: -50, left: 28,
          }}>
            {/* Logo / Avatar */}
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              border: `4px solid ${dark ? '#1e2433' : 'white'}`,
              overflow: 'hidden',
              background: '#0f1729',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
              <img
                src="/developer.png"
                alt="Fleury Zoé Dev"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:#1d9e75;font-family:Inter,sans-serif">FZ</div>`;
                }}
              />
            </div>
          </div>
        </div>
 
        {/* Infos profil */}
        <div style={{ padding: '60px 28px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{
                fontSize: 24, fontWeight: 800,
                color: dark ? '#f0f0f0' : '#1a2744',
                letterSpacing: '-0.5px', marginBottom: 4,
              }}>
                Fleury Zoé
              </h2>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: '#1d9e75', marginBottom: 8,
              }}>
                Développeur Web Front End · en exercice
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : '#a3a3a3',
              }}>
                <i className="ti ti-map-pin" style={{ fontSize: 15 }} />
                Bénin, Afrique de l'Ouest
              </div>
            </div>
 
            {/* Badge développeur */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: dark ? 'rgba(29,158,117,0.1)' : '#e8f8f2',
              border: '1px solid #1d9e75',
              borderRadius: 99, padding: '8px 16px',
            }}>
              <i className="ti ti-code" style={{ fontSize: 18, color: '#1d9e75' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1d9e75' }}>
                Fleury Zoé Dev
              </span>
            </div>
          </div>
 
          {/* Citation */}
          <div style={{
            marginTop: 24, padding: '16px 20px',
            background: dark ? 'rgba(29,158,117,0.06)' : '#f8fffe',
            borderLeft: '3px solid #1d9e75',
            borderRadius: '0 10px 10px 0',
          }}>
            <i className="ti ti-quote" style={{
              fontSize: 20, color: '#1d9e75',
              display: 'block', marginBottom: 6,
            }} />
            <p style={{
              fontSize: 14, fontStyle: 'italic',
              color: dark ? 'rgba(255,255,255,0.65)' : '#525252',
              lineHeight: 1.7, margin: 0,
            }}>
              {quote}
            </p>
          </div>
        </div>
      </div>
 
      {/* 2 COLONNES */}
      <div className="ft-grid-2" style={{ marginBottom: 20 }}>
 
        {/* COMPÉTENCES */}
        <div className="ft-card" style={{ padding: 24 }}>
          <h3 style={{
            fontSize: 15, fontWeight: 700,
            color: dark ? '#f0f0f0' : '#1a2744',
            marginBottom: 20, letterSpacing: '-0.3px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-code-dots" style={{ color: '#1d9e75', fontSize: 18 }} />
            {lang === 'fr' ? 'Compétences' : 'Skills'}
          </h3>
 
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
          }}>
            {skills.map((skill, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
                  background: dark ? 'rgba(255,255,255,0.03)' : '#fafafa',
                  cursor: 'default',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : skill.bg;
                  e.currentTarget.style.borderColor = skill.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : '#fafafa';
                  e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: skill.bg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${skill.icon}`} style={{ fontSize: 17, color: skill.color }} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: dark ? '#e5e5e5' : '#1a2744',
                }}>
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
 
        {/* CONTACT & RÉSEAUX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 
          {/* Réseaux sociaux */}
          <div className="ft-card" style={{ padding: 24 }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700,
              color: dark ? '#f0f0f0' : '#1a2744',
              marginBottom: 16, letterSpacing: '-0.3px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="ti ti-at" style={{ color: '#1d9e75', fontSize: 18 }} />
              Contact
            </h3>
 
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px',
                  borderRadius: 10,
                  marginBottom: 8,
                  textDecoration: 'none',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
                  background: dark ? 'rgba(255,255,255,0.03)' : '#fafafa',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : s.bg;
                  e.currentTarget.style.borderColor = s.color;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : '#fafafa';
                  e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: s.bg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.4)' : '#a3a3a3', marginBottom: 2 }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: dark ? '#e5e5e5' : '#1a2744' }}>
                    {s.handle}
                  </div>
                </div>
                <i className="ti ti-arrow-up-right" style={{
                  marginLeft: 'auto', fontSize: 16,
                  color: dark ? 'rgba(255,255,255,0.2)' : '#d4d4d4',
                }} />
              </a>
            ))}
          </div>
 
          {/* Stats rapides */}
          <div className="ft-card" style={{ padding: 24 }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700,
              color: dark ? '#f0f0f0' : '#1a2744',
              marginBottom: 16, letterSpacing: '-0.3px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i className="ti ti-award" style={{ color: '#1d9e75', fontSize: 18 }} />
              {lang === 'fr' ? 'En quelques chiffres' : 'By the numbers'}
            </h3>
 
            {[
              { label: lang === 'fr' ? 'Technologies maîtrisées' : 'Technologies', value: '8+', color: '#1d9e75' },
              { label: lang === 'fr' ? 'Projets réalisés'       : 'Projects built',  value: '1+', color: '#3b82f6' },
              { label: lang === 'fr' ? 'Passion pour le code'   : 'Passion for code', value: '∞',  color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 2 ? `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}` : 'none',
              }}>
                <span style={{ fontSize: 13.5, color: dark ? 'rgba(255,255,255,0.6)' : '#525252' }}>
                  {stat.label}
                </span>
                <span style={{
                  fontSize: 20, fontWeight: 800,
                  color: stat.color, letterSpacing: '-0.5px',
                }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* PROJETS */}
      <div className="ft-card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700,
          color: dark ? '#f0f0f0' : '#1a2744',
          marginBottom: 20, letterSpacing: '-0.3px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="ti ti-rocket" style={{ color: '#1d9e75', fontSize: 18 }} />
          {lang === 'fr' ? 'Projets réalisés' : 'Projects'}
        </h3>
 
        {projects.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px',
            borderRadius: 12,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
            background: dark ? 'rgba(255,255,255,0.02)' : '#fafafa',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1d9e75';
              e.currentTarget.style.background = dark ? 'rgba(29,158,117,0.06)' : '#f0fdf8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
              e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.02)' : '#fafafa';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: p.bg, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`ti ${p.icon}`} style={{ fontSize: 24, color: p.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: dark ? '#f0f0f0' : '#1a2744',
                marginBottom: 4,
              }}>
                {p.name}
              </div>
              <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.45)' : '#737373', lineHeight: 1.5 }}>
                {p.desc}
              </div>
            </div>
            <span className="ft-badge ft-badge-green">
              <i className="ti ti-check" style={{ fontSize: 11 }} />
              {lang === 'fr' ? 'En ligne' : 'Live'}
            </span>
          </div>
        ))}
      </div>
 
      {/* FOOTER SIGNATURE */}
      <div style={{
        textAlign: 'center', padding: '24px',
        borderRadius: 12,
        background: dark ? 'rgba(29,158,117,0.06)' : '#f8fffe',
        border: `1px solid ${dark ? 'rgba(29,158,117,0.12)' : '#d1fae5'}`,
      }}>
        <div style={{
          fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : '#a3a3a3',
          marginBottom: 6,
        }}>
          {lang === 'fr' ? 'Conçu et développé avec ❤️ par' : 'Designed & built with ❤️ by'}
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800,
          color: '#1d9e75', letterSpacing: '-0.3px',
        }}>
          Fleury Zoé Dev
        </div>
        <div style={{
          fontSize: 12, color:   dark ? 'rgba(255,255,255,0.25)' : '#a3a3a3',
          marginTop: 4,
        }}>
          React · Supabase · Tailwind · {new Date().getFullYear()}
        </div>
      </div>
 
    </div>
  );
} 
