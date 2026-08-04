import React, { useState, useEffect } from 'react';
import {
  AppData,
  TaskItem,
  SkillCourse,
  CourseLogItem,
  TabType,
  CategoryType,
  SubCategoryType,
  AcademicType,
  ResearchType
} from './types';
import {
  loadAppData,
  saveAppData
} from './utils/storage';
import { formatDateWithDay, getLocalDateStr } from './utils/date';
import {
  saveAppDataToFirebase,
  subscribeAppDataFromFirebase,
  isFirebaseConfigured
} from './utils/firebase';

import { Navbar } from './components/Navbar';
import { UpcomingAlertBanner } from './components/UpcomingAlertBanner';
import { AcademicSection } from './components/AcademicSection';
import { ResearchSection } from './components/ResearchSection';
import { SkillTrackerSection } from './components/SkillTrackerSection';
import { PlannerTimeline } from './components/PlannerTimeline';
import { CourseLogSection } from './components/CourseLogSection';
import { TaskModal } from './components/TaskModal';
import { LockScreen } from './components/LockScreen';

import {
  CheckCircle2,
  Plus,
  Calendar,
  Flame,
  Crown,
  Presentation,
  FlaskConical,
  Target,
  BookOpen,
  Laptop,
  FileText,
  Code,
  Video,
  GraduationCap,
  Sparkles
} from 'lucide-react';

// DYNAMIC ALTERNATING CARD COLOR VARIANTS (FOR VISUAL VARIETY ACROSS CARDS)
const CARD_COLOR_VARIANTS = [
  {
    bg: 'bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-slate-900/90 border-indigo-500/40 shadow-indigo-500/10 hover:border-indigo-500/70',
    topicBg: 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200',
    accentDot: 'text-indigo-400',
    badgeClass: 'badge-academic'
  },
  {
    bg: 'bg-gradient-to-b from-teal-950/40 via-emerald-950/20 to-slate-900/90 border-teal-500/40 shadow-teal-500/10 hover:border-teal-500/70',
    topicBg: 'bg-teal-950/40 border-teal-500/30 text-teal-200',
    accentDot: 'text-teal-400',
    badgeClass: 'badge-research'
  },
  {
    bg: 'bg-gradient-to-b from-pink-950/40 via-rose-950/20 to-slate-900/90 border-pink-500/40 shadow-pink-500/10 hover:border-pink-500/70',
    topicBg: 'bg-pink-950/40 border-pink-500/30 text-pink-200',
    accentDot: 'text-pink-400',
    badgeClass: 'badge-skill'
  },
  {
    bg: 'bg-gradient-to-b from-amber-950/40 via-orange-950/20 to-slate-900/90 border-amber-500/40 shadow-amber-500/10 hover:border-amber-500/70',
    topicBg: 'bg-amber-950/40 border-amber-500/30 text-amber-200',
    accentDot: 'text-amber-400',
    badgeClass: 'badge-general'
  },
  {
    bg: 'bg-gradient-to-b from-cyan-950/40 via-sky-950/20 to-slate-900/90 border-cyan-500/40 shadow-cyan-500/10 hover:border-cyan-500/70',
    topicBg: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200',
    accentDot: 'text-cyan-400',
    badgeClass: 'badge-academic'
  }
];

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Current Date State (Auto-refreshes at Midnight 12:00 AM in Local BD Timezone)
  const [currentDateStr, setCurrentDateStr] = useState<string>(
    () => getLocalDateStr()
  );

  // Authentication Lock State
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return sessionStorage.getItem('DAILYWORK_SESSION_AUTH') !== 'true';
  });

  // Modal Control States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [modalDefaultCategory, setModalDefaultCategory] = useState<CategoryType>('academic');
  const [modalDefaultSubCategory, setModalDefaultSubCategory] = useState<SubCategoryType>('ct');
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);

  // Sync state changes to localStorage & Firebase Firestore Cloud DB
  useEffect(() => {
    saveAppData(appData);
    saveAppDataToFirebase(appData);
  }, [appData]);

  // Subscribe to Real-Time Cloud Updates from Firebase Firestore
  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsubscribe = subscribeAppDataFromFirebase((remoteData) => {
        setAppData(remoteData);
        saveAppData(remoteData);
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync HTML root dark class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  // AUTOMATIC MIDNIGHT 12:00 AM DATE ROLLOVER TIMER (BD Time / System Local 00:00:00)
  useEffect(() => {
    const interval = setInterval(() => {
      const newDateStr = getLocalDateStr();
      if (newDateStr !== currentDateStr) {
        setCurrentDateStr(newDateStr);
        setAppData(loadAppData()); // Reload data & trigger auto-completion of overdue tasks
      }
    }, 5000); // Checks every 5 seconds

    return () => clearInterval(interval);
  }, [currentDateStr]);

  // Handle Lock / Unlock
  const handleUnlockApp = () => {
    setIsLocked(false);
  };

  const handleLockApp = () => {
    sessionStorage.removeItem('DAILYWORK_SESSION_AUTH');
    setIsLocked(true);
  };

  // Export JSON Backup
  const handleExportData = () => {
    const jsonStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dailywork_notebook_backup_${currentDateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Restore
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.tasks)) {
          setAppData(parsed);
          saveAppData(parsed);
          alert('✅ Notebook data restored successfully!');
        } else {
          alert('⚠️ Invalid backup JSON file format.');
        }
      } catch (err) {
        console.error('Failed to parse import JSON:', err);
        alert('⚠️ Failed to restore backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Task Operations
  const handleSaveTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'> & { id?: string }) => {
    if (taskData.id) {
      setAppData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t))
      }));
    } else {
      const newTask: TaskItem = {
        ...taskData,
        id: 'task-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      setAppData((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
    }
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setAppData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      setAppData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId)
      }));
    }
  };

  const handleOpenNewTask = (cat: CategoryType = 'academic', subCat: SubCategoryType = 'ct', dateStr?: string) => {
    setEditingTask(null);
    setModalDefaultCategory(cat);
    setModalDefaultSubCategory(subCat);
    setModalDefaultDate(dateStr);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Skill Operations
  const handleAddCourse = (c: Omit<SkillCourse, 'id' | 'updatedAt'>) => {
    const newCourse: SkillCourse = {
      ...c,
      id: 'course-' + Date.now(),
      updatedAt: new Date().toISOString()
    };
    setAppData((prev) => ({ ...prev, courses: [...prev.courses, newCourse] }));
  };

  const handleUpdateCourse = (c: SkillCourse) => {
    setAppData((prev) => ({
      ...prev,
      courses: prev.courses.map((item) => (item.id === c.id ? c : item))
    }));
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Delete this skill target?')) {
      setAppData((prev) => ({
        ...prev,
        courses: prev.courses.filter((item) => item.id !== courseId)
      }));
    }
  };

  // Class Tracker Operations
  const handleAddCourseLog = (course: Omit<CourseLogItem, 'id' | 'createdAt'>) => {
    const newCourseLog: CourseLogItem = {
      ...course,
      id: 'clog-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setAppData((prev) => ({
      ...prev,
      courseLogs: [...(prev.courseLogs || []), newCourseLog]
    }));
  };

  const handleUpdateCourseLog = (course: CourseLogItem) => {
    setAppData((prev) => ({
      ...prev,
      courseLogs: (prev.courseLogs || []).map((item) => (item.id === course.id ? course : item))
    }));
  };

  const handleDeleteCourseLog = (courseId: string) => {
    setAppData((prev) => ({
      ...prev,
      courseLogs: (prev.courseLogs || []).filter((item) => item.id !== courseId)
    }));
  };

  // Today's Tasks & Filtering
  const todayStr = currentDateStr;
  
  // TODAY'S WORK FILTER: Exclude CT, MT, Final Exam, Lab Final (they belong to Alert Banner)
  // Include Daily Study, Presentation, Lab Work, Research, Skill, General
  const rawTodaysTasks = appData.tasks.filter((t) => {
    if (t.dueDate !== todayStr) return false;
    const isExcludedExam = ['ct', 'mt', 'final', 'lab_final'].includes(t.subCategory);
    return !isExcludedExam;
  });

  // SORTING TODAY'S TASKS:
  // 1. Completed tasks pushed to bottom
  // 2. Category Sequence: Academic (1) -> Skill (2) -> Research (3) -> General (4)
  // 3. Priority Weight: Urgent (1) -> High (2) -> Medium (3)
  const categoryOrderWeight: Record<CategoryType, number> = {
    academic: 1,
    skill: 2,
    research: 3,
    general: 4
  };
  const priorityWeight: Record<string, number> = { urgent: 1, high: 2, medium: 3 };

  const sortedTodaysTasks = [...rawTodaysTasks].sort((a, b) => {
    const aDone = a.status === 'completed';
    const bDone = b.status === 'completed';
    if (aDone !== bDone) {
      return aDone ? 1 : -1; // Move completed tasks to bottom
    }
    
    // Sort by Category Sequence: Academic -> Skill -> Research -> General
    const catDiff = categoryOrderWeight[a.category] - categoryOrderWeight[b.category];
    if (catDiff !== 0) return catDiff;

    // Secondary Sort by Priority Weight
    return (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3);
  });

  const completedTodayCount = rawTodaysTasks.filter((t) => t.status === 'completed').length;
  const todayPercent = rawTodaysTasks.length > 0 ? Math.round((completedTodayCount / rawTodaysTasks.length) * 100) : 0;

  // Contextual Icon Helper for Today's Work cards
  const getTodayTaskIcon = (task: TaskItem) => {
    switch (task.subCategory) {
      case 'ct': return <Target size={16} className="text-amber-400" />;
      case 'mt': return <Flame size={16} className="text-red-400" />;
      case 'final': return <Crown size={16} className="text-yellow-400" />;
      case 'presentation': return <Presentation size={16} className="text-violet-400" />;
      case 'lab_final': return <FlaskConical size={16} className="text-emerald-400" />;
      case 'lab_work': return <Laptop size={16} className="text-teal-400" />;
      case 'daily_study': return <BookOpen size={16} className="text-indigo-400" />;
      case 'paper': return <FileText size={16} className="text-teal-400" />;
      case 'code': return <Code size={16} className="text-emerald-400" />;
      case 'paper_read': return <FileText size={16} className="text-amber-400" />;
      case 'book_read': return <BookOpen size={16} className="text-amber-400" />;
      default:
        if (task.category === 'skill') return <Video size={16} className="text-pink-400" />;
        return <BookOpen size={16} className="text-indigo-400" />;
    }
  };

  // IF LOCKED: RENDER HIGH-SECURITY LOCK SCREEN
  if (isLocked) {
    return <LockScreen onUnlock={handleUnlockApp} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-300">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTaskModal={() => handleOpenNewTask('academic', 'ct')}
        isDark={isDark}
        setIsDark={setIsDark}
        onLockApp={handleLockApp}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        
        {/* DASHBOARD: 2-COLUMN GRID (Left: Today's Work, Right: High Priority Alerts) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN (8 COLS): UNIFIED SINGLE MASTER CONTAINER CARD FOR TODAY'S WORK */}
            <div className="lg:col-span-8">
              <div className="glass-card p-5 sm:p-7 rounded-3xl space-y-6 border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-[var(--glass-bg)] to-slate-900/60 shadow-2xl relative">
                
                {/* 1. TOP CENTER DATE & DAY OF WEEK PILL WITH EDUCATIONAL VIBE BADGE */}
                <div className="flex flex-col items-center space-y-1.5 w-full mb-1">
                  <div className="inline-flex items-center space-x-2 text-xs sm:text-sm font-black px-4.5 py-1.5 rounded-full bg-indigo-500/25 text-indigo-200 border border-indigo-500/40 shadow-lg tracking-wide">
                    <span>📅</span>
                    <span>{formatDateWithDay(todayStr)}</span>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase text-indigo-300/80 px-2.5 py-0.5 rounded-md bg-black/40 border border-white/5">
                    <GraduationCap size={12} className="text-indigo-400" />
                    <span>Academic Scholar Zone • High-Focus Study Agenda</span>
                    <Sparkles size={11} className="text-amber-400" />
                  </div>
                </div>

                {/* 2. HEADER TITLE, PROGRESS BAR & ADD WORK BUTTON */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
                  <div className="flex items-center space-x-3">
                    <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                      ⚡
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-main)]">
                        Today's Work & Study Agenda
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 justify-between sm:justify-end">
                    {rawTodaysTasks.length > 0 && (
                      <div className="w-32 sm:w-40">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[var(--text-muted)]">Progress:</span>
                          <span className="text-indigo-400">{completedTodayCount}/{rawTodaysTasks.length} ({todayPercent}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-[var(--border-color)]">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${todayPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenNewTask('academic', 'daily_study', todayStr)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 shrink-0"
                    >
                      <Plus size={16} />
                      <span>+ Add Work</span>
                    </button>
                  </div>
                </div>

                {/* SINGLE UNIFIED MASTER CONTAINER ITEM ROWS WITH ALTERNATING DYNAMIC COLORS */}
                {sortedTodaysTasks.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-2xl border border-[var(--border-color)]">
                    <Calendar size={44} className="mx-auto text-[var(--text-subtle)] mb-2 opacity-40" />
                    <p className="text-sm font-bold text-[var(--text-muted)]">
                      No study work scheduled for today ({formatDateWithDay(todayStr)}).
                    </p>
                    <button
                      onClick={() => handleOpenNewTask('academic', 'daily_study', todayStr)}
                      className="mt-3 text-xs font-bold text-indigo-400 hover:underline"
                    >
                      + Add a daily study topic or skill task for today
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {sortedTodaysTasks.map((task, idx) => {
                      const isDone = task.status === 'completed';
                      const isDueToday = task.dueDate === todayStr;
                      const icon = getTodayTaskIcon(task);

                      // Select dynamic alternating color variant for visual variety
                      const colorVariant = CARD_COLOR_VARIANTS[idx % CARD_COLOR_VARIANTS.length];

                      /* SKILL AND GENERAL TASKS: ULTRA-COMPACT SINGLE-LINE PILL ROW */
                      if (task.category === 'skill' || task.category === 'general') {
                        return (
                          <div
                            key={task.id}
                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border card-hover-lift animate-card-slide ${
                              isDone
                                ? 'opacity-50 bg-[var(--bg-surface)] border-[var(--border-color)]'
                                : colorVariant.bg
                            }`}
                          >
                            <div className="flex items-center space-x-3 truncate pr-3">
                              <span className="p-1 rounded-lg bg-black/40 border border-white/10 shrink-0">
                                {icon}
                              </span>
                              
                              <div className="flex items-center space-x-2 truncate">
                                <span className={`text-xs font-extrabold truncate ${task.category === 'skill' ? 'text-pink-300' : 'text-amber-300'}`}>
                                  {task.title} {task.category === 'skill' && task.skillTargetAmount ? `: ${task.skillTargetAmount}` : task.category === 'general' && task.generalTargetCount ? `: ${task.generalTargetCount}` : ''}
                                </span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${colorVariant.badgeClass} shrink-0`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>

                            {isDueToday && (
                              <button
                                onClick={() => handleToggleTaskStatus(task.id)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 shrink-0 transition-all ${
                                  isDone
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                                }`}
                              >
                                <CheckCircle2 size={13} />
                                <span>{isDone ? 'Done' : 'Mark Done'}</span>
                              </button>
                            )}
                          </div>
                        );
                      }

                      /* ACADEMIC AND RESEARCH TASKS: VIBRANT ALTERNATING CARD ROW */
                      return (
                        <div
                          key={task.id}
                          className={`p-4 sm:p-5 rounded-2xl border card-hover-lift animate-card-slide ${
                            isDone
                              ? 'opacity-50 bg-[var(--bg-surface)] border-[var(--border-color)]'
                              : task.priority === 'urgent'
                              ? 'bg-red-950/20 border-red-500/40 shadow-md ring-1 ring-red-500/30'
                              : colorVariant.bg
                          }`}
                        >
                          <div>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="p-1 rounded-lg bg-black/40 border border-white/10">
                                  {icon}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ${colorVariant.badgeClass}`}>
                                  {task.category}
                                </span>
                              </div>

                              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded badge-${task.priority}`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Course Code & Name */}
                            {task.category === 'academic' && (task.courseCode || task.courseName) && (
                              <div className="flex items-center space-x-2 my-1.5">
                                {task.courseCode && (
                                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-black/50 text-indigo-300 border border-indigo-500/40">
                                    {task.courseCode}
                                  </span>
                                )}
                                {task.courseName && (
                                  <span className="text-xs font-bold text-[var(--text-muted)] truncate">
                                    {task.courseName}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Title */}
                            <h4
                              className={`font-extrabold text-base transition-colors ${
                                isDone ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-main)]'
                              }`}
                            >
                              {task.title}
                            </h4>

                            {/* ITEM ROWS WITH MARK DONE BUTTON ALIGNED IN RIGHT COLUMN */}
                            <div className="space-y-2.5 my-3">
                              
                              {/* ACADEMIC TOPICS LIST */}
                              {task.category === 'academic' && task.topicsList && task.topicsList.map((top, idx) => (
                                <div
                                  key={`top-${idx}`}
                                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-black/60 border ${colorVariant.topicBg} shadow-sm`}
                                >
                                  <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-200 truncate pr-2">
                                    <span className={`${colorVariant.accentDot} font-bold`}>•</span>
                                    <span className="truncate">{top}</span>
                                  </div>
                                  {isDueToday && (
                                    <button
                                      onClick={() => handleToggleTaskStatus(task.id)}
                                      className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 shrink-0 transition-all ${
                                        isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                      }`}
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>{isDone ? 'Done' : 'Mark Done'}</span>
                                    </button>
                                  )}
                                </div>
                              ))}

                              {/* RESEARCH CODE MODIFICATIONS */}
                              {task.category === 'research' && task.subCategory === 'code' && task.codeDetails && (
                                <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-black/60 border border-emerald-500/40 shadow-sm">
                                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-300 truncate pr-2">
                                    <span>💻</span>
                                    <span className="truncate">Code Edits: {task.codeDetails}</span>
                                  </div>
                                  {isDueToday && (
                                    <button
                                      onClick={() => handleToggleTaskStatus(task.id)}
                                      className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 shrink-0 transition-all ${
                                        isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                      }`}
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>{isDone ? 'Done' : 'Mark Done'}</span>
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* RESEARCH PAPER WRITING */}
                              {task.category === 'research' && task.subCategory === 'paper' && task.paperPart && (
                                <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-black/60 border border-teal-500/40 shadow-sm">
                                  <div className="flex items-center space-x-2 text-xs font-semibold text-teal-300 truncate pr-2">
                                    <span>📄</span>
                                    <span className="truncate">Paper Section: {task.paperPart}</span>
                                  </div>
                                  {isDueToday && (
                                    <button
                                      onClick={() => handleToggleTaskStatus(task.id)}
                                      className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 shrink-0 transition-all ${
                                        isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                      }`}
                                    >
                                      <CheckCircle2 size={13} />
                                      <span>{isDone ? 'Done' : 'Mark Done'}</span>
                                    </button>
                                  )}
                                </div>
                              )}

                            </div>

                            {/* Description */}
                            {task.description && (
                              <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN (4 COLS): HIGH PRIORITY ALERTS & EXAM CENTER VERTICAL SIDEBAR STACK */}
            <div className="lg:col-span-4">
              <UpcomingAlertBanner
                tasks={appData.tasks}
                onToggleStatus={handleToggleTaskStatus}
              />
            </div>

          </div>
        )}

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <AcademicSection
            tasks={appData.tasks}
            onToggleStatus={handleToggleTaskStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddNewAcademic={(subCat: AcademicType) => handleOpenNewTask('academic', subCat)}
          />
        )}

        {/* Research Tab */}
        {activeTab === 'research' && (
          <ResearchSection
            tasks={appData.tasks}
            onToggleStatus={handleToggleTaskStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddNewResearch={(subCat: ResearchType) => handleOpenNewTask('research', subCat)}
          />
        )}

        {/* Skill Growup Tab */}
        {activeTab === 'skills' && (
          <SkillTrackerSection
            courses={appData.courses}
            tasks={appData.tasks}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddNewSkillTask={() => handleOpenNewTask('skill', 'general')}
          />
        )}

        {/* Monthly Planner Tab */}
        {activeTab === 'planner' && (
          <PlannerTimeline
            tasks={appData.tasks}
            onToggleStatus={handleToggleTaskStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onAddNewTaskWithDate={(dateStr) => handleOpenNewTask('academic', 'ct', dateStr)}
          />
        )}

        {/* Class Tracker Tab (Semester Course Syllabus Log) */}
        {activeTab === 'course_log' && (
          <CourseLogSection
            courseLogs={appData.courseLogs || []}
            onAddCourseLog={handleAddCourseLog}
            onUpdateCourseLog={handleUpdateCourseLog}
            onDeleteCourseLog={handleDeleteCourseLog}
          />
        )}

      </main>

      {/* MINIMALIST MOTIVATIONAL FOOTER */}
      <footer className="border-t border-[var(--border-color)] bg-black/40 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs italic text-indigo-200/90 font-semibold max-w-md mx-auto leading-relaxed">
            "Success is the sum of small efforts, repeated day in and day out."
          </p>
        </div>
      </footer>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
        defaultCategory={modalDefaultCategory}
        defaultSubCategory={modalDefaultSubCategory}
        defaultDate={modalDefaultDate}
      />

    </div>
  );
}
