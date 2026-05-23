import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
 
export default function Projects({ session }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const dark = theme === 'dark';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
 
  const C = {
    card:   dark ? '#1e2433' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.06)' : '#e8e8e8',
    text:   dark ? '#f0f0f0' : '#1a2744',
    sub:    dark ? 'rgba(255,255,255,0.45)' : '#737373',
    bg:     dark ? '#111318' : '#f5f5f5',
    green:  '#1d9e75',
    navy:   '#1a2744',
  };
 
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);
 
  // eslint-disable-next-line
  useEffect(() => { fetchProjects(); }, []);
 
  async function fetchProjects() {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*, project_members(user_id, role, profiles(full_name))')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }
 
  async function saveProject() {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editProject) {
      await supabase.from('projects')
        .update({ name: form.name, description: form.description })
        .eq('id', editProject.id);
    } else {
      const { data } = await supabase.from('projects')
        .insert([{ name: form.name, description: form.description, owner_id: session.user.id }])
        .select().single();
      if (data) {
        await supabase.from('project_members').insert([{
          project_id: data.id,
          user_id: session.user.id,
          role: 'admin',
        }]);
      }
    }
    setForm({ name: '', description: '' });
    setShowModal(false);
    setEditProject(null);
    setSaving(false);
    fetchProjects();
  }
 
  async function deleteProject(id) {
    await supabase.from('projects').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchProjects();
  }
 
  async function inviteMember() {
    if (!inviteEmail.trim() || !selectedProject) return;
    setInviting(true);
    const { data: user } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', inviteEmail)
      .single();
 
    if (!user) {
      alert(lang === 'fr' ? 'Utilisateur introuvable.' : 'User not found.');
      setInviting(false);
      return;
    }
 
    await supabase.from('project_members').upsert([{
      project_id: selectedProject.id,
      user_id: user.id,
      role: 'member',
    }]);
 
    setInviteEmail('');
    setInviting(false);
    setShowInviteModal(false);
    fetchProjects();
  }
 
  async function removeMember(projectId, userId) {
    await supabase.from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);
    fetchProjects();
  }
 
  const openEdit = (p) => {
    setEditProject(p);
    setForm({ name: p.name, description: p.description || '' });
    setShowModal(true);
  };
 
  const openInvite = (p) => {
    setSelectedProject(p);
    setShowInviteModal(true);
  };
 
  const projectColors = ['#1d9e75','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
  const getColor = (i) => projectColors[i % projectColors.length];
 
  const Modal = ({ title, onClose, children }) => (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: dark ? '#1e2433' : 'white',
        borderRadius: 16, padding: 28,
        width: '100%', maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'fadeUp 0.2s ease',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: '-0.3px' }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.sub, fontSize: 22,
          }}>
            <i className="ti ti-x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
 
  const Label = ({ children }) => (
    <label style={{
      fontSize: 12, fontWeight: 600,
      color: C.sub, display: 'block',
      marginBottom: 6, textTransform: 'uppercase',
      letterSpacing: '0.06em',
    }}>
      {children}
    </label>
  );
 
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
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 32, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div className="ft-page-eyebrow" style={{ textAlign: 'left' }}>
            {lang === 'fr' ? 'Organisation' : 'Organization'}
          </div>
          <h1 className="ft-page-title" style={{ textAlign: 'left' }}>
            {lang === 'fr' ? 'Mes projets' : 'My projects'}
          </h1>
          <p className="ft-page-subtitle">
            {projects.length} {lang === 'fr' ? 'projet(s) en cours' : 'active project(s)'}
          </p>
        </div>
        <button
          className="ft-btn ft-btn-navy"
          onClick={() => { setEditProject(null); setForm({ name: '', description: '' }); setShowModal(true); }}
        >
          <i className="ti ti-plus" />
          {lang === 'fr' ? 'Nouveau projet' : 'New project'}
        </button>
      </div>
 
      {/* LISTE DES PROJETS */}
      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: C.card,
          borderRadius: 16,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: '#e8f8f2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <i className="ti ti-folder-off" style={{ fontSize: 32, color: '#1d9e75' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            {lang === 'fr' ? 'Aucun projet pour le moment' : 'No projects yet'}
          </div>
          <div style={{ fontSize: 14, color: C.sub, marginBottom: 24 }}>
            {lang === 'fr' ? 'Créez votre premier projet pour commencer' : 'Create your first project to get started'}
          </div>
          <button
            className="ft-btn ft-btn-green"
            onClick={() => setShowModal(true)}
          >
            <i className="ti ti-plus" />
            {lang === 'fr' ? 'Créer un projet' : 'Create a project'}
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {projects.map((project, i) => {
            const color = getColor(i);
            const members = project.project_members || [];
            return (
              <div
                key={project.id}
                className="ft-card"
                style={{
                  padding: 0, overflow: 'hidden',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Barre couleur */}
                <div style={{ height: 5, background: color }} />
 
                <div style={{ padding: 20 }}>
                  {/* Header projet */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', marginBottom: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: color + '20', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className="ti ti-briefcase" style={{ fontSize: 20, color }} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: 15, fontWeight: 700, color: C.text,
                          marginBottom: 2,
                        }}>
                          {project.name}
                        </div>
                        <div style={{ fontSize: 12, color: C.sub }}>
                          {new Date(project.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
 
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => openInvite(project)}
                        style={{
                          width: 30, height: 30, borderRadius: 7,
                          border: `1px solid ${C.border}`,
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: C.sub, fontSize: 15, transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#3b82f6'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.sub; }}
                        title={lang === 'fr' ? 'Inviter un membre' : 'Invite member'}
                      >
                        <i className="ti ti-user-plus" />
                      </button>
                      <button
                        onClick={() => openEdit(project)}
                        style={{
                          width: 30, height: 30, borderRadius: 7,
                          border: `1px solid ${C.border}`,
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: C.sub, fontSize: 15, transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e8f8f2'; e.currentTarget.style.color = '#1d9e75'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.sub; }}
                        title={lang === 'fr' ? 'Modifier' : 'Edit'}
                      >
                        <i className="ti ti-pencil" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        style={{
                          width: 30, height: 30, borderRadius: 7,
                          border: `1px solid ${C.border}`,
                          background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: C.sub, fontSize: 15, transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fff1f1'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.sub; }}
                        title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                      >
                        <i className="ti ti-trash" />
                      </button>
                    </div>
                  </div>
 
                  {/* Description */}
                  {project.description && (
                    <p style={{
                      fontSize: 13, color: C.sub,
                      lineHeight: 1.5, marginBottom: 16,
                    }}>
                      {project.description}
                    </p>
                  )}
 
                  {/* Barre progression */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 12, color: C.sub, marginBottom: 6,
                    }}>
                      <span>{lang === 'fr' ? 'Progression' : 'Progress'}</span>
                      <span style={{ fontWeight: 600, color }}>40%</span>
                    </div>
                    <div style={{
                      height: 5, background: dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0',
                      borderRadius: 99, overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: '40%',
                        background: color, borderRadius: 99,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
 
                  {/* Membres */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ display: 'flex' }}>
                        {members.slice(0, 4).map((m, mi) => (
                          <div
                            key={mi}
                            style={{
                              width: 26, height: 26, borderRadius: '50%',
                              background: getColor(mi),
                              border: `2px solid ${dark ? '#1e2433' : 'white'}`,
                              marginLeft: mi > 0 ? -8 : 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 700, color: 'white',
                              title: m.profiles?.full_name || '',
                            }}
                          >
                            {(m.profiles?.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {members.length > 4 && (
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: dark ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
                            border: `2px solid ${dark ? '#1e2433' : 'white'}`,
                            marginLeft: -8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 700, color: C.sub,
                          }}>
                            +{members.length - 4}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: C.sub }}>
                        {members.length} {lang === 'fr' ? 'membre(s)' : 'member(s)'}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      background: color + '20', color,
                      padding: '3px 10px', borderRadius: 99,
                    }}>
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
 
      {/* MODAL CRÉER / MODIFIER PROJET */}
      {showModal && (
        <Modal
          title={editProject
            ? (lang === 'fr' ? 'Modifier le projet' : 'Edit project')
            : (lang === 'fr' ? 'Nouveau projet' : 'New project')}
          onClose={() => { setShowModal(false); setEditProject(null); setForm({ name: '', description: '' }); }}
        >
          <div style={{ marginBottom: 16 }}>
            <Label>{lang === 'fr' ? 'Nom du projet *' : 'Project name *'}</Label>
            <input
              className="ft-input"
              placeholder={lang === 'fr' ? 'Ex: Refonte site web...' : 'Ex: Website redesign...'}
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <Label>{lang === 'fr' ? 'Description (optionnel)' : 'Description (optional)'}</Label>
            <textarea
              className="ft-input"
              placeholder={lang === 'fr' ? 'Décrivez votre projet...' : 'Describe your project...'}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              style={{ resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="ft-btn ft-btn-ghost"
              style={{ flex: 1 }}
              onClick={() => { setShowModal(false); setEditProject(null); }}
            >
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              className="ft-btn ft-btn-navy"
              style={{ flex: 2 }}
              onClick={saveProject}
              disabled={saving || !form.name.trim()}
            >
              <i className={`ti ${saving ? 'ti-loader' : 'ti-check'}`} />
              {saving
                ? (lang === 'fr' ? 'Sauvegarde...' : 'Saving...')
                : editProject
                  ? (lang === 'fr' ? 'Modifier' : 'Save changes')
                  : (lang === 'fr' ? 'Créer le projet' : 'Create project')
              }
            </button>
          </div>
        </Modal>
      )}
 
      {/* MODAL INVITER UN MEMBRE */}
      {showInviteModal && selectedProject && (
        <Modal
          title={lang === 'fr' ? 'Inviter un membre' : 'Invite a member'}
          onClose={() => { setShowInviteModal(false); setInviteEmail(''); }}
        >
          <div style={{
            background: dark ? 'rgba(29,158,117,0.08)' : '#e8f8f2',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            fontSize: 13, color: dark ? '#9fe1cb' : '#0f6e56',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-folder" />
            {selectedProject.name}
          </div>
 
          <div style={{ marginBottom: 16 }}>
            <Label>{lang === 'fr' ? 'ID utilisateur Supabase' : 'Supabase user ID'}</Label>
            <input
              className="ft-input"
              placeholder="uuid-de-l-utilisateur"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              autoFocus
            />
            <div style={{ fontSize: 12, color: C.sub, marginTop: 6 }}>
              <i className="ti ti-info-circle" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />
              {lang === 'fr'
                ? 'L\'utilisateur doit d\'abord créer un compte sur Fleury Task'
                : 'The user must first create an account on Fleury Task'}
            </div>
          </div>
 
          {/* Membres actuels */}
          {selectedProject.project_members?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <Label>{lang === 'fr' ? 'Membres actuels' : 'Current members'}</Label>
              {selectedProject.project_members.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#1d9e75',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'white',
                    }}>
                      {(m.profiles?.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                        {m.profiles?.full_name || 'Utilisateur'}
                      </div>
                      <div style={{ fontSize: 11, color: C.sub }}>{m.role}</div>
                    </div>
                  </div>
                  {m.user_id !== session.user.id && (
                    <button
                      onClick={() => removeMember(selectedProject.id, m.user_id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ef4444', fontSize: 16, padding: 4,
                        transition: 'opacity 0.12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <i className="ti ti-user-minus" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
 
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="ft-btn ft-btn-ghost"
              style={{ flex: 1 }}
              onClick={() => setShowInviteModal(false)}
            >
              {lang === 'fr' ? 'Fermer' : 'Close'}
            </button>
            <button
              className="ft-btn ft-btn-green"
              style={{ flex: 2 }}
              onClick={inviteMember}
              disabled={inviting || !inviteEmail.trim()}
            >
              <i className="ti ti-user-plus" />
              {inviting
                ? (lang === 'fr' ? 'Invitation...' : 'Inviting...')
                : (lang === 'fr' ? 'Inviter' : 'Invite')
              }
            </button>
          </div>
        </Modal>
      )}
 
      {/* MODAL CONFIRMATION SUPPRESSION */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: dark ? '#1e2433' : 'white',
            borderRadius: 16, padding: 28,
            width: '100%', maxWidth: 400,
            textAlign: 'center',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: '#fff1f1', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-trash" style={{ fontSize: 26, color: '#ef4444' }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>
              {lang === 'fr' ? 'Supprimer ce projet ?' : 'Delete this project?'}
            </div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 24, lineHeight: 1.5 }}>
              {lang === 'fr'
                ? 'Cette action est irréversible. Toutes les tâches associées seront supprimées.'
                : 'This action is irreversible. All associated tasks will be deleted.'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="ft-btn ft-btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setDeleteConfirm(null)}
              >
                {lang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                style={{
                  flex: 1, padding: '10px 16px',
                  background: '#ef4444', color: 'white',
                  border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
                onClick={() => deleteProject(deleteConfirm)}
                onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
              >
                <i className="ti ti-trash" style={{ marginRight: 6 }} />
                {lang === 'fr' ? 'Supprimer' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  
