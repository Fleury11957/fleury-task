import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
 
export default function Dashboard({ session, setCurrentPage }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const dark = theme === 'dark';
 
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);
 
  // eslint-disable-next-line
  useEffect(() => { fetchData(); }, []);
 
  async function fetchData() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data: td } = await supabase.from('tasks')
      .select('*').eq('assignee_id', session.user.id)
      .lte('due_date', today).neq('status', 'done')
      .order('priority', { ascending: false }).limit(8);
    const { data: pd } = await supabase.from('projects')
      .select('*').eq('owner_id', session.user.id)
      .order('created_at', { ascending: false }).limit(6);
    setTasks(td || []);
    setProjects(pd || []);
    setLoading(false);
  }
 
  async function toggleTask(task) {
    const ns = task.status === 'done' ? 'todo' : 'done';
    await supabase.from('tasks').update({ status: ns }).eq('id', task.id);
    setTasks(prev => prev.map(tk => tk.id === task.id ? { ...tk, status: ns } : tk));
  }
 
  const firstName = session.user.user_metadata?.full_name?.split(' ')[0]
    || session.user.email.split('@')[0];
 
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return `Bonjour, ${firstName} ☀️`;
    if (h < 18) return `Bon après-midi, ${firstName} 👋`;
    return `Bonsoir, ${firstName} 🌙`;
  };
 
  const stats = [
    { icon: 'ti-list-check', label: t.todayTasks,  value: tasks.length,                                    color: '#1d9e75', bg: '#e8f8f2' },
    { icon: 'ti-folders',    label: t.projects,     value: projects.length,                                 color: '#3b82f6', bg: '#eff6ff' },
    { icon: 'ti-progress',   label: t.inProgress,   value: tasks.filter(t => t.status === 'in_progress').length, color: '#f59e0b', bg: '#fff8eb' },
    { icon: 'ti-flame',      label: t.urgent,       value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444', bg: '#fff1f1' },
  ];
 
  const priorityInfo = {
    high:   { label: 'Urgent',  cls: 'ft-badge-red'   },
    medium: { label: 'Moyen',   cls: 'ft-badge-amber' },
    low:    { label: 'Faible',  cls: 'ft-badge-gray'  },
  };
 
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <div style={{
        width: 36, height: 36,
        border: '2.5px solid #e8f8f2',
        borderTop: '2.5px solid #1d9e75',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
 
  return (
    <div className="ft-page fade-up">
 
      {/* PAGE HEADER */}
      <div className="ft-page-header">
        <div className="ft-page-eyebrow">{greeting()}</div>
        <h1 className="ft-page-title">{t.dashboard}</h1>
        <p className="ft-page-subtitle">Voici un aperçu de votre activité du jour.</p>
      </div>
 
      {/* STATS */}
      <div className="ft-grid-4" style={{ marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="ft-stat">
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: s.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: s.color }} />
            </div>
            <div style={{
              fontSize: 36, fontWeight: 800, color: s.color,
              letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 6,
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: 13, fontWeight: 500,
              color: dark ? 'rgba(255,255,255,0.45)' : '#737373',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
 
      {/* 2 COLONNES */}
      <div className="ft-grid-2">
 
        {/* TÂCHES DU JOUR */}
        <div className="ft-card" style={{ padding: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 20,
          }}>
            <h2 style={{
              fontSize: 16, fontWeight: 700,
              color: dark ? '#f0f0f0' : '#1a2744',
              letterSpacing: '-0.3px',
            }}>
              {t.todayTasks}
            </h2>
            <span className="ft-badge ft-badge-green">
              {tasks.filter(t => t.status === 'done').length} / {tasks.length}
            </span>
          </div>
 
          {/* Liste tâches */}
          {tasks.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 16px',
              color: dark ? 'rgba(255,255,255,0.25)' : '#a3a3a3',
            }}>
              <i className="ti ti-checks" style={{
                fontSize: 40, display: 'block', marginBottom: 10,
                color: '#1d9e75', opacity: 0.6,
              }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>{t.noTasks}</div>
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                Profitez de votre journée !
              </div>
            </div>
          ) : tasks.map((task, i) => {
            const pi = priorityInfo[task.priority] || priorityInfo.low;
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '10px 8px',
                  borderRadius: 8,
                  borderBottom: i < tasks.length - 1
                    ? `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`
                    : 'none',
                  transition: 'background 0.12s',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task)}
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: task.status === 'done'
                      ? '2px solid #1d9e75'
                      : `2px solid ${dark ? 'rgba(255,255,255,0.2)' : '#d4d4d4'}`,
                    background: task.status === 'done' ? '#1d9e75' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                    color: 'white', fontSize: 11,
                    transition: 'all 0.15s',
                  }}
                >
                  {task.status === 'done' && <i className="ti ti-check" />}
                </button>
 
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 500,
                    color: task.status === 'done'
                      ? (dark ? 'rgba(255,255,255,0.25)' : '#a3a3a3')
                      : (dark ? '#e5e5e5' : '#1a2744'),
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    marginBottom: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {task.due_date && (
                      <span style={{
                        fontSize: 11.5, color: dark ? 'rgba(255,255,255,0.35)' : '#a3a3a3',
                        display: 'flex', alignItems: 'center', gap: 3,
                      }}>
                        <i className="ti ti-calendar" style={{ fontSize: 12 }} />
                        {task.due_date}
                      </span>
                    )}
                    <span className={`ft-badge ${pi.cls}`}>{pi.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
 
          {/* Bouton */}
          <div style={{ marginTop: 20 }}>
            <button
              className="ft-btn ft-btn-navy"
              onClick={() => setCurrentPage && setCurrentPage('kanban')}
              style={{ width: '100%' }}
            >
              <i className="ti ti-plus" />
              {t.newTask}
            </button>
          </div>
        </div>
 
        {/* PROJETS RÉCENTS */}
        <div className="ft-card" style={{ padding: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 20,
          }}>
            <h2 style={{
              fontSize: 16, fontWeight: 700,
              color: dark ? '#f0f0f0' : '#1a2744',
              letterSpacing: '-0.3px',
            }}>
              {t.recentProjects}
            </h2>
            <button
              style={{
                fontSize: 12.5, fontWeight: 600, color: '#1d9e75',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                padding: '3px 6px', borderRadius: 4,
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8f8f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {t.viewAll} →
            </button>
          </div>
 
          {projects.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 16px',
              color: dark ? 'rgba(255,255,255,0.25)' : '#a3a3a3',
            }}>
              <i className="ti ti-folder-off" style={{
                fontSize: 40, display: 'block', marginBottom: 10, opacity: 0.5,
              }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>{t.noProjects}</div>
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                Créez votre premier projet
              </div>
            </div>
          ) : projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 10px',
                borderRadius: 8,
                marginBottom: 4,
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderLeft: '2px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#fafafa';
                e.currentTarget.style.borderLeftColor = '#1d9e75';
                e.currentTarget.style.paddingLeft = '14px';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderLeftColor = 'transparent';
                e.currentTarget.style.paddingLeft = '10px';
              }}
            >
              {/* Icône projet */}
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: '#1a2744', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ti ti-briefcase" style={{ fontSize: 18, color: '#1d9e75' }} />
              </div>
 
              {/* Info projet */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 600,
                  color: dark ? '#e5e5e5' : '#1a2744',
                  marginBottom: 6,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {p.name}
                </div>
                {/* Barre de progression */}
                <div style={{
                  height: 4, background: dark ? 'rgba(255,255,255,0.08)' : '#efefef',
                  borderRadius: 99, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: '40%',
                    background: 'linear-gradient(90deg, #1d9e75, #0f9e6a)',
                    borderRadius: 99,
                  }} />
                </div>
              </div>
 
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: '#1d9e75', flexShrink: 0,
              }}>
                40%
              </div>
            </div>
          ))}
 
          <div style={{ marginTop: 20 }}>
            <button className="ft-btn ft-btn-ghost" style={{ width: '100%' }}>
              <i className="ti ti-plus" />
              {t.newProject}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}