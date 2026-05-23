 
import { createContext, useContext, useState } from 'react';
 
const LangContext = createContext();
 
export const translations = {
  fr: {
    appName: 'Fleury Task',
    dashboard: 'Tableau de bord',
    kanban: 'Kanban',
    calendar: 'Calendrier',
    stats: 'Statistiques',
    settings: 'Paramètres',
    newTask: '+ Nouvelle tâche',
    newProject: '+ Nouveau projet',
    today: "Aujourd'hui",
    tasks: 'Tâches',
    projects: 'Projets',
    completion: 'Complétion',
    thisMonth: 'Ce mois',
    done: 'Terminé',
    inProgress: 'En cours',
    todo: 'À faire',
    urgent: 'Urgent',
    pending: 'En attente',
    dueDate: 'Échéance',
    viewAll: 'Voir tout',
    todayTasks: "Tâches du jour",
    recentProjects: 'Projets récents',
    noTasks: 'Aucune tâche pour aujourd\'hui',
    noProjects: 'Aucun projet en cours',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    profile: 'Profil',
    logout: 'Se déconnecter',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    title: 'Titre',
    description: 'Description',
    priority: 'Priorité',
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
    welcomeBack: 'Bon retour',
    loading: 'Chargement...',
  },
  en: {
    appName: 'Fleury Task',
    dashboard: 'Dashboard',
    kanban: 'Kanban',
    calendar: 'Calendar',
    stats: 'Statistics',
    settings: 'Settings',
    newTask: '+ New task',
    newProject: '+ New project',
    today: 'Today',
    tasks: 'Tasks',
    projects: 'Projects',
    completion: 'Completion',
    thisMonth: 'This month',
    done: 'Done',
    inProgress: 'In progress',
    todo: 'To do',
    urgent: 'Urgent',
    pending: 'Pending',
    dueDate: 'Due date',
    viewAll: 'View all',
    todayTasks: "Today's tasks",
    recentProjects: 'Recent projects',
    noTasks: 'No tasks for today',
    noProjects: 'No active projects',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    profile: 'Profile',
    logout: 'Sign out',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    title: 'Title',
    description: 'Description',
    priority: 'Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    welcomeBack: 'Welcome back',
    loading: 'Loading...',
  }
};
 
export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('fleury-lang') || 'fr';
  });
 
  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('fleury-lang', newLang);
    setLang(newLang);
  };
 
  const t = translations[lang];
 
  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
 
export const useLang = () => useContext(LangContext);