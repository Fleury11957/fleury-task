import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Calendar from './pages/Calendar';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import About from './pages/About';
import Projects from './pages/Projects';
import Landing from './pages/Landing';
import Notifications from './pages/Notifications';
 
function AppContent() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { theme } = useTheme();
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
 
  useEffect(() => {
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [theme]);
 
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#1a2744',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <div style={{
        fontSize: 28, fontWeight: 800, color: 'white',
        letterSpacing: '-0.8px',
        fontFamily: "'Inter', sans-serif",
      }}>
        Fleury <span style={{ color: '#1d9e75' }}>Task</span>
      </div>
      <div style={{
        width: 36, height: 36,
        border: '2.5px solid rgba(29,158,117,0.2)',
        borderTop: '2.5px solid #1d9e75',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
 
  if (!session) return <Landing onLogin={() => {}} />;
 
  const pages = {
    dashboard: <Dashboard session={session} setCurrentPage={setCurrentPage} />,
    kanban:    <Kanban    session={session} />,
    calendar:  <Calendar  session={session} />,
    stats:     <Stats     session={session} />,
    settings:  <Settings  session={session} />,
    about: <About session={session} />,
    projects: <Projects session={session} />,
    notifications: <Notifications session={session} />,
  };
 
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} session={session} />
      <main className="ft-main">
        {pages[currentPage]}
      </main>
    </div>
  );
}
 
export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AppContent />
      </LangProvider>
    </ThemeProvider>
  );
}