 import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
 
// ============================================================
// Hook global à utiliser dans App.js pour les notifications
// ============================================================
export function useNotifications(session) {
  const [unread, setUnread] = useState(0);
 
  useEffect(() => {
    if (!session) return;
    fetchUnread();
 
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${session.user.id}`,
      }, () => {
        fetchUnread();
        // Notification push navigateur
        if (Notification.permission === 'granted') {
          new Notification('Fleury Task', {
            body: 'Vous avez une nouvelle notification !',
            icon: '/developer.png',
          });
        }
      })
      .subscribe();
 
    return () => supabase.removeChannel(channel);
  }, [session]);
 
  async function fetchUnread() {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('is_read', false);
    setUnread(count || 0);
  }
 
  return { unread, refetch: fetchUnread };
}
 
// ============================================================
// Page Notifications
// ============================================================
export default function Notifications({ session }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const dark = theme === 'dark';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState(Notification.permission);
 
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);
 
  // eslint-disable-next-line
  useEffect(() => { fetchNotifications(); }, []);
 
  async function fetchNotifications() {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*, tasks(title)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data || []);
    setLoading(false);
  }
 
  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', session.user.id)
      .eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }
 
  async function markRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }
 
  async function deleteNotification(id) {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }
 
  async function requestPermission() {
    const result = await Notification.requestPermission();
    setPermission(result);
  }
 
  const typeInfo = {
    task_assigned: {
      icon: 'ti-user-check',
      color: '#3b82f6',
      bg: '#eff6ff',
      label: lang === 'fr' ? 'Tâche assignée' : 'Task assigned',
    },
    task_commented: {
      icon: 'ti-message-circle',
      color: '#1d9e75',
      bg: '#e8f8f2',
      label: lang === 'fr' ? 'Nouveau commentaire' : 'New comment',
    },
    task_due_soon: {
      icon: 'ti-clock',
      color: '#f59e0b',
      bg: '#fff8eb',
      label: lang === 'fr' ? 'Échéance proche' : 'Due soon',
    },
    member_invited: {
      icon: 'ti-users',
      color: '#8b5cf6',
      bg: '#f5f3ff',
      label: lang === 'fr' ? 'Invitation projet' : 'Project invite',
    },
  };
 
  const formatTime = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return lang === 'fr' ? 'À l\'instant' : 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
  };
 
  const unread = notifications.filter(n => !n.is_read).length;
 
  const C = {
    card:   dark ? '#1e2433' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.06)' : '#e8e8e8',
    text:   dark ? '#f0f0f0' : '#1a2744',
    sub:    dark ? 'rgba(255,255,255,0.45)' : '#737373',
  };
 
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <div style={{ width: 36, height: 36, border: '2.5px solid #e8f8f2', borderTop: '2.5px solid #1d9e75', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
 
  return (
    <div className="ft-page fade-up">
 
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>
            {lang === 'fr' ? 'Alertes' : 'Alerts'}
          </div>
          <h1 className="ft-page-title" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
            {lang === 'fr' ? 'Notifications' : 'Notifications'}
            {unread > 0 && (
              <span style={{ fontSize: 16, fontWeight: 700, background: '#ef4444', color: 'white', borderRadius: 99, padding: '2px 10px' }}>
                {unread}
              </span>
            )}
          </h1>
          <p className="ft-page-subtitle">
            {unread > 0
              ? `${unread} ${lang === 'fr' ? 'non lue(s)' : 'unread'}`
              : lang === 'fr' ? 'Tout est à jour !' : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button className="ft-btn ft-btn-ghost" onClick={markAllRead}>
            <i className="ti ti-checks" />
            {lang === 'fr' ? 'Tout marquer lu' : 'Mark all read'}
          </button>
        )}
      </div>
 
      {/* BANNIÈRE PERMISSION PUSH */}
      {permission === 'default' && (
        <div style={{
          background: dark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
          border: `1px solid ${dark ? 'rgba(59,130,246,0.2)' : '#bfdbfe'}`,
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
          marginBottom: 20, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-bell" style={{ fontSize: 20, color: '#3b82f6' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                {lang === 'fr' ? 'Activer les notifications push' : 'Enable push notifications'}
              </div>
              <div style={{ fontSize: 12, color: C.sub }}>
                {lang === 'fr' ? 'Recevez des alertes en temps réel' : 'Get real-time alerts'}
              </div>
            </div>
          </div>
          <button className="ft-btn ft-btn-navy" onClick={requestPermission}>
            <i className="ti ti-bell" />
            {lang === 'fr' ? 'Activer' : 'Enable'}
          </button>
        </div>
      )}
 
      {permission === 'granted' && (
        <div style={{
          background: dark ? 'rgba(29,158,117,0.08)' : '#e8f8f2',
          border: `1px solid ${dark ? 'rgba(29,158,117,0.15)' : '#9fe1cb'}`,
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 20, fontSize: 13, color: '#0f6e56',
        }}>
          <i className="ti ti-bell-check" style={{ fontSize: 18 }} />
          {lang === 'fr' ? 'Notifications push activées ✓' : 'Push notifications enabled ✓'}
        </div>
      )}
 
      {/* LISTE NOTIFICATIONS */}
      {notifications.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#e8f8f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="ti ti-bell-off" style={{ fontSize: 32, color: '#1d9e75' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            {lang === 'fr' ? 'Aucune notification' : 'No notifications'}
          </div>
          <div style={{ fontSize: 14, color: C.sub }}>
            {lang === 'fr' ? 'Vous êtes à jour sur tout !' : 'You\'re all caught up!'}
          </div>
        </div>
      ) : (
        <div className="ft-card" style={{ overflow: 'hidden' }}>
          {notifications.map((notif, i) => {
            const info = typeInfo[notif.type] || typeInfo.task_assigned;
            return (
              <div
                key={notif.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 20px',
                  background: !notif.is_read
                    ? (dark ? 'rgba(29,158,117,0.05)' : '#fafffe')
                    : 'transparent',
                  borderBottom: i < notifications.length - 1 ? `1px solid ${C.border}` : 'none',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onClick={() => markRead(notif.id)}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = !notif.is_read ? (dark ? 'rgba(29,158,117,0.05)' : '#fafffe') : 'transparent'}
              >
                {/* Icône type */}
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: info.bg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${info.icon}`} style={{ fontSize: 20, color: info.color }} />
                </div>
 
                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, background: info.bg, color: info.color, padding: '2px 8px', borderRadius: 99 }}>
                      {info.label}
                    </span>
                    {!notif.is_read && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: notif.is_read ? 400 : 600, color: C.text, marginBottom: 4 }}>
                    {notif.tasks?.title || (lang === 'fr' ? 'Tâche supprimée' : 'Deleted task')}
                  </div>
                  <div style={{ fontSize: 12, color: C.sub }}>
                    {formatTime(notif.created_at)}
                  </div>
                </div>
 
                {/* Supprimer */}
                <button
                  onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: `1px solid ${C.border}`,
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.sub, fontSize: 14, flexShrink: 0,
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fff1f1'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.sub; }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
