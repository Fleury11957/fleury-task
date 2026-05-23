
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import TaskDetail from '../components/TaskDetail';
 
export default function Stats({ session }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const dark = theme === 'dark';
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');     
  }, [dark]); 
 
  // eslint-disable-next-line
  useEffect(() => { fetchData(); }, []);
 
  async function fetchData() {
    setLoading(true);
    const { data: td } = await supabase.from('tasks').select('*').eq('assignee_id', session.user.id);
    const { data: pd } = await supabase.from('projects').select('*').eq('owner_id', session.user.id);
    setTasks(td || []);
    setProjects(pd || []);
    setLoading(false);
  }
 
  const total      = tasks.length;
  const done       = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo       = tasks.filter(t => t.status === 'todo').length;
  const urgent     = tasks.filter(t => t.priority === 'high').length;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;
 
  const stats = [
    { icon: 'ti-list-check', label: 'Total',       value: total,             color: '#3b82f6', bg: '#eff6ff' },
    { icon: 'ti-checks',     label: t.done,         value: done,              color: '#1d9e75', bg: '#e8f8f2' },
    { icon: 'ti-progress',   label: t.inProgress,   value: inProgress,        color: '#f59e0b', bg: '#fff8eb' },
    { icon: 'ti-clock',      label: t.todo,         value: todo,              color: '#737373', bg: '#f5f5f5' },
    { icon: 'ti-flame',      label: t.urgent,       value: urgent,            color: '#ef4444', bg: '#fff1f1' },
    { icon: 'ti-folders',    label: t.projects,     value: projects.length,   color: '#8b5cf6', bg: '#f5f3ff' },
  ];
 
  const Bar = ({ label, value, max, color, bg }) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 13.5, fontWeight: 500, color: dark ? '#e5e5e5' : '#1a2744' }}>{label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.35)' : '#a3a3a3',
              background: dark ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
              padding: '2px 7px', borderRadius: 99,
            }}>{pct}%</span>
          </div>
        </div>
        <div style={{
          height: 8, background: dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0',
          borderRadius: 99, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`, background: color,
            borderRadius: 99, transition: 'width 1s ease',
          }} />
        </div>
      </div>
    );
  };
 
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      <div style={{
        width: 36, height: 36,
        border: '2.5px solid #e8f8f2',
        borderTop: '2.5px solid #1d9e75',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
 
  return (
    <div className="ft-page fade-up">
 
      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>Analyse</div>
        <h1 className="ft-page-title" style={{ textAlign: 'left' }}>{t.stats}</h1>
        <p className="ft-page-subtitle">Suivez votre productivité et vos progrès</p>
      </div>
 
      {/* STATS GRID */}
      <div className="ft-grid-3" style={{ marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="ft-stat">
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 18,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: s.color }} />
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: dark ? 'rgba(255,255,255,0.3)' : '#a3a3a3',
                background: dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                padding: '3px 9px', borderRadius: 99,
              }}>
                {total > 0 ? Math.round((s.value / (total || 1)) * 100) : 0}%
              </span>
            </div>
            <div style={{
              fontSize: 38, fontWeight: 800, color: s.color,
              letterSpacing: '-2px', lineHeight: 1, marginBottom: 6,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.45)' : '#737373' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
 
      {/* 2 COLONNES */}
      <div className="ft-grid-2">
 
        {/* Complétion */}
        <div className="ft-card" style={{ padding: 28 }}>
          <h2 style={{
            fontSize: 16, fontWeight: 700, color: dark ? '#f0f0f0' : '#1a2744',
            marginBottom: 28, letterSpacing: '-0.3px',
          }}>
            Taux de complétion global
          </h2>
 
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 28 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48"
                  fill="none"
                  stroke={dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}
                  strokeWidth="10" />
                <circle cx="60" cy="60" r="48"
                  fill="none" stroke="#1d9e75" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - completion / 100)}`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1d9e75', letterSpacing: '-1px', lineHeight: 1 }}>
                  {completion}%
                </div>
                <div style={{ fontSize: 10, color: dark ? 'rgba(255,255,255,0.4)' : '#a3a3a3', fontWeight: 600, marginTop: 2 }}>
                  FAIT
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.45)' : '#737373', marginBottom: 4 }}>
                {done} tâches terminées
              </div>
              <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.45)' : '#737373', marginBottom: 4 }}>
                {inProgress} en cours
              </div>
              <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.45)' : '#737373' }}>
                {todo} à faire
              </div>
            </div>
          </div>
 
          <Bar label={t.done}       value={done}       max={total} color="#1d9e75" />
          <Bar label={t.inProgress} value={inProgress} max={total} color="#f59e0b" />
          <Bar label={t.todo}       value={todo}       max={total} color="#737373" />
        </div>
 
        {/* Priorités */}
        <div className="ft-card" style={{ padding: 28 }}>
          <h2 style={{
            fontSize: 16, fontWeight: 700, color: dark ? '#f0f0f0' : '#1a2744',
            marginBottom: 28, letterSpacing: '-0.3px',
          }}>
            Répartition par priorité
          </h2>
 
          {[
            { label: 'Urgente',  value: tasks.filter(t => t.priority === 'high').length,   color: '#ef4444', bg: '#fff1f1', icon: 'ti-flame' },
            { label: 'Moyenne',  value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b', bg: '#fff8eb', icon: 'ti-minus' },
            { label: 'Faible',   value: tasks.filter(t => t.priority === 'low').length,    color: '#1d9e75', bg: '#e8f8f2', icon: 'ti-arrow-down' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 12px', borderRadius: 12, marginBottom: 8,
              border: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'}`,
              transition: 'all 0.15s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#fafafa';
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.05)' : '#f5f5f5';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: item.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 20, color: item.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: dark ? '#e5e5e5' : '#1a2744', marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ height: 5, background: dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: total > 0 ? `${(item.value / total) * 100}%` : '0%',
                    background: item.color, borderRadius: 99,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color, letterSpacing: '-1px', flexShrink: 0 }}>
                {item.value}
              </div>
            </div>
          ))}
 
          {/* Projets */}
          <div style={{
            marginTop: 16, padding: '16px 14px',
            background: dark ? 'rgba(139,92,246,0.08)' : '#f5f3ff',
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14,
            border: `1px solid ${dark ? 'rgba(139,92,246,0.15)' : '#ede9fe'}`,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: dark ? 'rgba(139,92,246,0.15)' : '#ede9fe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-folders" style={{ fontSize: 22, color: '#8b5cf6' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                {t.projects} actifs
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#8b5cf6', letterSpacing: '-1px', lineHeight: 1 }}>
                {projects.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}