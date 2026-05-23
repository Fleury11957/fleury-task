import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { supabase } from '../lib/supabase';
 
export default function Navbar({ currentPage, setCurrentPage, session }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const dark = theme === 'dark';
 
  const navItems = [
    { id: 'dashboard', icon: 'ti-layout-dashboard', label: t.dashboard },
    { id: 'kanban',    icon: 'ti-layout-kanban',    label: t.kanban },
    { id: 'calendar',  icon: 'ti-calendar-event',   label: t.calendar },
    { id: 'stats',     icon: 'ti-chart-bar',         label: t.stats },
    { id: 'settings',  icon: 'ti-settings',          label: t.settings },
    { id: 'about', icon: 'ti-user-circle', label: lang === 'fr' ? 'À propos' : 'About' },
    { id: 'projects', icon: 'ti-folders', label: lang === 'fr' ? 'Projets' : 'Projects' },
    { id: 'notifications', icon: 'ti-bell', label: lang === 'fr' ? 'Notifications' : 'Notifications' },
  ];
 
  const initials = (session?.user?.user_metadata?.full_name || session?.user?.email || 'U')
    .charAt(0).toUpperCase();
 
  return (
    <>
      {/* ===== SIDEBAR DESKTOP ===== */}
      <aside className="ft-sidebar">
        {/* Header */}
        <div className="ft-sidebar-header">
          <div className="ft-logo">
            Fleury <span>Task</span>
          </div>
          <div className="ft-user-info">
            <div className="ft-avatar">{initials}</div>
            <span className="ft-user-email">{session?.user?.email}</span>
          </div>
        </div>
 
        {/* Navigation */}
        <nav className="ft-nav">
          <div className="ft-nav-label">Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`ft-nav-btn ${currentPage === item.id ? 'active' : ''}`}
            >
              <i className={`ti ${item.icon}`} />
              {item.label}
            </button>
          ))}
        </nav>
 
        {/* Footer */}
        <div className="ft-nav-footer">
          <button onClick={toggleTheme} className="ft-nav-footer-btn">
            <i className={`ti ${dark ? 'ti-sun' : 'ti-moon-stars'}`} />
            {dark ? t.lightMode : t.darkMode}
          </button>
          <button onClick={toggleLang} className="ft-nav-footer-btn">
            <i className="ti ti-world" />
            {lang === 'fr' ? 'English' : 'Français'}
          </button>
          <button onClick={() => supabase.auth.signOut()} className="ft-nav-footer-btn danger">
            <i className="ti ti-logout" />
            {t.logout}
          </button>
        </div>
      </aside>
 
      {/* ===== TOPBAR MOBILE ===== */}
      <header className="ft-topbar">
        <div className="ft-logo" style={{ fontSize: 16 }}>
          Fleury <span>Task</span>
        </div>
        <div className="ft-topbar-actions">
          <button onClick={toggleLang} className="ft-topbar-btn">
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button onClick={toggleTheme} className="ft-topbar-btn">
            <i className={`ti ${dark ? 'ti-sun' : 'ti-moon-stars'}`} style={{ fontSize: 16 }} />
          </button>
        </div>
      </header>
 
      {/* ===== BOTTOM NAV MOBILE ===== */}
      <nav className="ft-bottomnav">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`ft-bottomnav-btn ${currentPage === item.id ? 'active' : ''}`}
          >
            <i className={`ti ${item.icon}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}