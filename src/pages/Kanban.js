import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import TaskDetail from '../components/TaskDetail';
 
export default function Kanban({ session }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const dark = theme === 'dark';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', due_date: '', status: 'todo' });
  const [selectedTask, setSelectedTask] = useState(null);
 
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);
 
  // eslint-disable-next-line
  useEffect(() => { fetchTasks(); }, []);
 
  async function fetchTasks() {
    setLoading(true);
    const { data } = await supabase.from('tasks')
      .select('*').eq('assignee_id', session.user.id)
      .order('position', { ascending: true });
    setTasks(data || []);
    setLoading(false);
  }
 
  async function createTask() {
    if (!newTask.title.trim()) return;
    const { data } = await supabase.from('tasks').insert([{
      ...newTask,
      assignee_id: session.user.id,
      project_id: null,
      position: tasks.length,
    }]).select().single();
    if (data) {
      setTasks(prev => [...prev, data]);
      setNewTask({ title: '', priority: 'medium', due_date: '', status: 'todo' });
      setShowModal(false);
    }
  }
 
  async function moveTask(task, newStatus) {
    await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  }
 
  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }
 
  const columns = [
    { id: 'todo',        label: t.todo,       color: '#737373', bg: '#f5f5f5', darkBg: 'rgba(255,255,255,0.04)' },
    { id: 'in_progress', label: t.inProgress, color: '#3b82f6', bg: '#eff6ff', darkBg: 'rgba(59,130,246,0.08)' },
    { id: 'done',        label: t.done,       color: '#1d9e75', bg: '#e8f8f2', darkBg: 'rgba(29,158,117,0.08)' },
  ];
 
  const priorityInfo = {
    high:   { label: 'Urgent', cls: 'ft-badge-red',   icon: 'ti-flame' },
    medium: { label: 'Moyen',  cls: 'ft-badge-amber', icon: 'ti-minus' },
    low:    { label: 'Faible', cls: 'ft-badge-gray',  icon: 'ti-arrow-down' },
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
 
      {/* HEADER */}
      <div className="ft-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', textAlign: 'left' }}>
        <div>
          <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>Gestion des tâches</div>
          <h1 className="ft-page-title" style={{ textAlign: 'left' }}>{t.kanban}</h1>
          <p className="ft-page-subtitle">Cliquez sur une tâche pour voir les détails</p>
        </div>
        <button className="ft-btn ft-btn-navy" onClick={() => setShowModal(true)}>
          <i className="ti ti-plus" />
          {t.newTask}
        </button>
      </div>
 
      {/* COLONNES KANBAN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} style={{
              background: dark ? col.darkBg : col.bg,
              borderRadius: 12,
              padding: 16,
              minHeight: 400,
              border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e8e8e8'}`,
            }}>
              {/* En-tête colonne */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: col.color,
                  }} />
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: dark ? '#e5e5e5' : '#1a2744',
                    letterSpacing: '-0.2px',
                  }}>
                    {col.label}
                  </span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  background: dark ? 'rgba(255,255,255,0.08)' : 'white',
                  color: dark ? 'rgba(255,255,255,0.5)' : '#737373',
                  borderRadius: 99, padding: '2px 8px',
                }}>
                  {colTasks.length}
                </span>
              </div>
 
              {/* Tâches */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colTasks.map(task => {
                  const pi = priorityInfo[task.priority] || priorityInfo.low;
                  return (
                    <div
                      key={task.id}
                      className="ft-card"
                      style={{
                        padding: 14,
                        cursor: 'pointer',
                        borderRadius: 10,
                        transition: 'all 0.15s',
                      }}
                      onClick={() => setSelectedTask(task)}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = col.color;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      <div style={{
                        fontSize: 13.5, fontWeight: 500,
                        color: dark ? '#e5e5e5' : '#1a2744',
                        marginBottom: 10, lineHeight: 1.4,
                      }}>
                        {task.title}
                      </div>
 
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                        <span className={`ft-badge ${pi.cls}`}>
                          <i className={`ti ${pi.icon}`} style={{ fontSize: 11 }} />
                          {pi.label}
                        </span>
                        {task.due_date && (
                          <span style={{
                            fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : '#a3a3a3',
                            display: 'flex', alignItems: 'center', gap: 3,
                          }}>
                            <i className="ti ti-calendar" style={{ fontSize: 12 }} />
                            {task.due_date}
                          </span>
                        )}
                      </div>
 
                      {/* Actions déplacer */}
                      <div style={{
                        display: 'flex', gap: 4, marginTop: 10,
                        paddingTop: 10,
                        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
                      }}>
                        {columns.filter(c => c.id !== col.id).map(c => (
                          <button
                            key={c.id}
                            onClick={e => { e.stopPropagation(); moveTask(task, c.id); }}
                            style={{
                              flex: 1, padding: '4px 6px',
                              border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e8e8e8'}`,
                              borderRadius: 6, background: 'transparent',
                              fontSize: 11, fontWeight: 600,
                              color: c.color, cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif',
                              transition: 'all 0.12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = c.bg}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            → {c.label}
                          </button>
                        ))}
                        <button
                          onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #fff1f1',
                            borderRadius: 6, background: 'transparent',
                            fontSize: 13, color: '#ef4444', cursor: 'pointer',
                            transition: 'all 0.12s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff1f1'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className="ti ti-trash" />
                        </button>
                      </div>
                    </div>
                  );
                })}
 
                {/* Zone vide */}
                {colTasks.length === 0 && (
                  <div style={{
                    textAlign: 'center', padding: '32px 12px',
                    color: dark ? 'rgba(255,255,255,0.2)' : '#d4d4d4',
                    fontSize: 13,
                    border: `1.5px dashed ${dark ? 'rgba(255,255,255,0.08)' : '#e8e8e8'}`,
                    borderRadius: 10,
                  }}>
                    <i className="ti ti-inbox" style={{ fontSize: 28, display: 'block', marginBottom: 6 }} />
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
 
      {/* MODAL DÉTAIL TÂCHE */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          session={session}
          onClose={() => setSelectedTask(null)}
        />
      )}
 
      {/* MODAL NOUVELLE TÂCHE */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{
            background: dark ? '#1e2433' : 'white',
            borderRadius: 16, padding: 28,
            width: '100%', maxWidth: 460,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            animation: 'fadeUp 0.2s ease',
          }}>
            <div style={{
              fontSize: 18, fontWeight: 700,
              color: dark ? '#f0f0f0' : '#1a2744',
              marginBottom: 20, letterSpacing: '-0.3px',
            }}>
              <i className="ti ti-plus" style={{ marginRight: 8, color: '#1d9e75' }} />
              {t.newTask}
            </div>
 
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.5)' : '#737373', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.title} *
              </label>
              <input
                className="ft-input"
                placeholder="Nom de la tâche..."
                value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                autoFocus
              />
            </div>
 
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.5)' : '#737373', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.priority}
                </label>
                <select
                  className="ft-input"
                  value={newTask.priority}
                  onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="low">{t.low}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="high">{t.high}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.5)' : '#737373', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.dueDate}
                </label>
                <input
                  type="date"
                  className="ft-input"
                  value={newTask.due_date}
                  onChange={e => setNewTask(p => ({ ...p, due_date: e.target.value }))}
                />
              </div>
            </div>
 
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.5)' : '#737373', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Colonne
              </label>
              <select
                className="ft-input"
                value={newTask.status}
                onChange={e => setNewTask(p => ({ ...p, status: e.target.value }))}
                style={{ cursor: 'pointer' }}
              >
                <option value="todo">{t.todo}</option>
                <option value="in_progress">{t.inProgress}</option>
                <option value="done">{t.done}</option>
              </select>
            </div>
 
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="ft-btn ft-btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                {t.cancel}
              </button>
              <button className="ft-btn ft-btn-navy" style={{ flex: 2 }} onClick={createTask}>
                <i className="ti ti-check" />
                Créer la tâche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}