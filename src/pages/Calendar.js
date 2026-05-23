import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
 
export default function Calendar({ session }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const dark = theme === 'dark';
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
 
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);
 
  // eslint-disable-next-line
  useEffect(() => { fetchTasks(); }, []);
 
  async function fetchTasks() {
    const { data } = await supabase.from('tasks')
      .select('*').eq('assignee_id', session.user.id)
      .not('due_date', 'is', null);
    setTasks(data || []);
  }
 
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
 
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const dayNames   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
 
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset      = (firstDay + 6) % 7;
  const cells       = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
 
  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return tasks.filter(tk => tk.due_date === dateStr);
  };
 
  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
 
  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#1d9e75' };
 
  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : [];
 
  return (
    <div className="ft-page fade-up">
 
      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>Planning</div>
          <h1 className="ft-page-title" style={{ textAlign: 'left' }}>{t.calendar}</h1>
          <p className="ft-page-subtitle">Visualisez vos échéances et planifiez</p>
        </div>
        <button className="ft-btn ft-btn-ghost" onClick={() => setCurrentDate(new Date())}>
          <i className="ti ti-calendar-event" />
          Aujourd'hui
        </button>
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: selectedDay ? '1fr 280px' : '1fr', gap: 20, alignItems: 'start' }}>
 
        {/* CALENDRIER */}
        <div className="ft-card" style={{ padding: 28 }}>
 
          {/* Navigation */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 28,
          }}>
            <button className="ft-btn ft-btn-ghost" style={{ padding: '8px 14px' }} onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <i className="ti ti-chevron-left" style={{ fontSize: 18 }} />
            </button>
            <h2 style={{
              fontSize: 20, fontWeight: 800, color: dark ? '#f0f0f0' : '#1a2744',
              letterSpacing: '-0.5px',
            }}>
              {monthNames[month]} {year}
            </h2>
            <button className="ft-btn ft-btn-ghost" style={{ padding: '8px 14px' }} onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <i className="ti ti-chevron-right" style={{ fontSize: 18 }} />
            </button>
          </div>
 
          {/* Jours semaine */}
          <div className="ft-cal-grid" style={{ marginBottom: 8 }}>
            {dayNames.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 700,
                color: dark ? 'rgba(255,255,255,0.3)' : '#a3a3a3',
                padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{d}</div>
            ))}
          </div>
 
          {/* Jours */}
          <div className="ft-cal-grid">
            {cells.map((day, i) => {
              const dayTasks = getTasksForDay(day);
              const todayDay = isToday(day);
              const selected = selectedDay === day;
 
              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDay(selected ? null : day)}
                  className={`ft-cal-day ${todayDay ? 'today' : ''} ${selected ? 'selected' : ''}`}
                  style={{ opacity: day ? 1 : 0 }}
                >
                  {day && (
                    <>
                      <div style={{
                        fontSize: 13, fontWeight: todayDay ? 800 : 500,
                        color: todayDay ? '#1d9e75' : (dark ? '#e5e5e5' : '#1a2744'),
                        textAlign: 'right', marginBottom: 6,
                      }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {dayTasks.slice(0, 3).map((task, ti) => (
                          <div key={ti} style={{
                            height: 5, borderRadius: 99,
                            background: priorityColor[task.priority] || '#1d9e75',
                            opacity: 0.85,
                          }} />
                        ))}
                        {dayTasks.length > 3 && (
                          <div style={{ fontSize: 9, fontWeight: 700, color: '#1d9e75', textAlign: 'center' }}>
                            +{dayTasks.length - 3}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
 
          {/* Légende */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 20,
            paddingTop: 16, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`,
            flexWrap: 'wrap',
          }}>
            {[
              { color: '#ef4444', label: 'Urgent' },
              { color: '#f59e0b', label: 'Moyen' },
              { color: '#1d9e75', label: 'Faible' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 5, borderRadius: 99, background: item.color }} />
                <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : '#a3a3a3', fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
 
        {/* PANEL JOUR */}
        {selectedDay && (
          <div className="ft-card" style={{ padding: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 16,
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1d9e75', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  {dayNames[(new Date(year, month, selectedDay).getDay() + 6) % 7]}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: dark ? '#f0f0f0' : '#1a2744', letterSpacing: '-0.5px' }}>
                  {selectedDay} {monthNames[month]}
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} style={{
                background: dark ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
                border: 'none', borderRadius: 8,
                width: 30, height: 30, cursor: 'pointer',
                color: dark ? 'rgba(255,255,255,0.5)' : '#737373',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : '#e8e8e8'}
                onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : '#f5f5f5'}
              >
                <i className="ti ti-x" />
              </button>
            </div>
 
            {selectedTasks.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '28px 12px',
                color: dark ? 'rgba(255,255,255,0.2)' : '#d4d4d4',
              }}>
                <i className="ti ti-calendar-off" style={{ fontSize: 36, display: 'block', marginBottom: 10 }} />
                <div style={{ fontSize: 13, fontWeight: 500 }}>Aucune tâche ce jour</div>
              </div>
            ) : selectedTasks.map(task => (
              <div key={task.id} style={{
                padding: '12px 10px', borderRadius: 10, marginBottom: 6,
                border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
                transition: 'all 0.12s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = priorityColor[task.priority];
                  e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : '#fafafa';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: priorityColor[task.priority],
                  }} />
                  <div style={{
                    fontSize: 13.5, fontWeight: 600,
                    color: dark ? '#e5e5e5' : '#1a2744',
                  }}>
                    {task.title}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : '#a3a3a3', paddingLeft: 16 }}>
                  {task.status === 'done' ? '✅ Terminé' : task.status === 'in_progress' ? '⏳ En cours' : '○ À faire'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}