import React from 'react';
import { TaskItem } from '../types';
import { formatDateWithDay, getLocalDateStr } from '../utils/date';
import { ShieldAlert, Clock, CheckCircle2, Flame, Crown, Presentation, FlaskConical, Target } from 'lucide-react';

interface UpcomingAlertBannerProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string) => void;
  onEditTask?: (task: TaskItem) => void;
}

export const UpcomingAlertBanner: React.FC<UpcomingAlertBannerProps> = ({
  tasks,
  onToggleStatus
}) => {
  const alertTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const isAcademicExam = ['ct', 'mt', 'final', 'presentation', 'lab_final'].includes(t.subCategory);
    const isUrgentPriority = t.priority === 'urgent';
    return isAcademicExam || isUrgentPriority;
  });

  const sortedAlerts = [...alertTasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (sortedAlerts.length === 0) return null;

  const todayStr = getLocalDateStr();

  const getDaysRemaining = (task: TaskItem) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isFinalExamNear = task.subCategory === 'final' && diffDays <= 3;
    const isTomorrow = diffDays === 1;
    const isToday = diffDays === 0;

    if (isToday) {
      return {
        label: 'TODAY!',
        isRedAlert: true,
        badgeClass: 'bg-red-500/40 text-red-100 border-red-500/80 font-black animate-bounce shadow-lg shadow-red-500/50 ring-2 ring-red-500/70'
      };
    }
    if (isTomorrow) {
      return {
        label: 'TOMORROW!',
        isRedAlert: true,
        badgeClass: 'bg-red-500/40 text-red-100 border-red-500/80 font-black animate-pulse shadow-lg shadow-red-500/50 ring-2 ring-red-500/70'
      };
    }
    if (isFinalExamNear) {
      return {
        label: `Final in ${diffDays} Days!`,
        isRedAlert: true,
        badgeClass: 'bg-red-500/40 text-red-100 border-red-500/80 font-black animate-pulse shadow-lg shadow-red-500/50 ring-2 ring-red-500/70'
      };
    }

    if (diffDays < 0) return { label: `${Math.abs(diffDays)} Days Overdue!`, isRedAlert: true, badgeClass: 'bg-red-500/30 text-red-200 border-red-500/60 animate-pulse font-black' };
    
    return { label: `In ${diffDays} Days`, isRedAlert: false, badgeClass: 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50 font-bold' };
  };

  const getContextualInfo = (subCat: string) => {
    switch (subCat) {
      case 'ct':
        return { label: 'Class Test (CT)', icon: <Target size={14} className="text-amber-400" /> };
      case 'mt':
        return { label: 'Mid Term (MT)', icon: <Flame size={14} className="text-red-400" /> };
      case 'final':
        return { label: 'Semester Final', icon: <Crown size={14} className="text-yellow-400" /> };
      case 'presentation':
        return { label: 'Presentation', icon: <Presentation size={14} className="text-violet-400" /> };
      case 'lab_final':
        return { label: 'Lab Final', icon: <FlaskConical size={14} className="text-emerald-400" /> };
      default:
        return { label: subCat.toUpperCase(), icon: <ShieldAlert size={14} className="text-red-400" /> };
    }
  };

  return (
    <div className="space-y-4">
      {/* Right Column Header */}
      <div className="glass-card p-4 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/50 via-slate-900/90 to-indigo-950/50 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-wide uppercase text-[var(--text-main)]">
              Urgent Alerts & Exams
            </h2>
            <p className="text-[10px] text-red-300 font-semibold">High Priority Warning Tracker</p>
          </div>
        </div>

        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/50 shadow-md">
          {sortedAlerts.length} Active
        </span>
      </div>

      {/* Vertical Stacked Cards with Neon Alert Pulse */}
      <div className="space-y-4">
        {sortedAlerts.map((task) => {
          const daysInfo = getDaysRemaining(task);
          const context = getContextualInfo(task.subCategory);
          const isDueToday = task.dueDate === todayStr;

          return (
            <div
              key={task.id}
              className={`glass-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                daysInfo.isRedAlert
                  ? 'neon-alert-pulse bg-gradient-to-b from-red-950/40 via-[var(--bg-surface)] to-[var(--bg-primary)] ring-2 ring-red-500/60'
                  : 'border border-indigo-500/30 hover:border-indigo-500/60 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-primary)] shadow-lg'
              }`}
            >
              <div>
                {/* Header: Type + Countdown */}
                <div className="flex items-center justify-between space-x-2 mb-2.5">
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10">
                    {context.icon}
                    <span className="text-[11px] font-black text-[var(--text-main)] uppercase">
                      {context.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${daysInfo.badgeClass}`}>
                      {daysInfo.label}
                    </span>
                  </div>
                </div>

                {/* Course Code & Name */}
                {(task.courseCode || task.courseName) && (
                  <div className="flex items-center space-x-2 my-2">
                    {task.courseCode && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                        {task.courseCode}
                      </span>
                    )}
                    {task.courseName && (
                      <span className="text-xs font-extrabold text-[var(--text-muted)] truncate">
                        {task.courseName}
                      </span>
                    )}
                  </div>
                )}

                {/* Title */}
                <h3 className="font-extrabold text-sm text-[var(--text-main)] mt-1">
                  {task.title}
                </h3>

                {/* Syllabus Points List */}
                {task.syllabusPoints && task.syllabusPoints.length > 0 && (
                  <div className="mt-2.5 bg-black/50 p-2.5 rounded-xl border border-amber-500/30 space-y-1">
                    <p className="text-[10px] font-black text-amber-300 uppercase">📜 Syllabus Breakdown:</p>
                    {task.syllabusPoints.map((point, idx) => (
                      <div key={idx} className="text-xs text-[var(--text-main)] font-semibold flex items-start space-x-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Class Test Topics List */}
                {task.topicsList && task.topicsList.length > 0 && (
                  <div className="mt-2.5 bg-black/50 p-2.5 rounded-xl border border-indigo-500/30 space-y-1">
                    <p className="text-[10px] font-black text-indigo-300 uppercase">📌 Topics Breakdown:</p>
                    {task.topicsList.map((top, idx) => (
                      <div key={idx} className="text-xs text-[var(--text-main)] font-semibold flex items-start space-x-1.5">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{top}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date & Mark Done Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[var(--text-muted)] flex items-center space-x-1">
                  <Clock size={12} className="text-indigo-400" />
                  <span>{formatDateWithDay(task.dueDate)}</span>
                </span>

                {isDueToday ? (
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="flex items-center space-x-1 px-3.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all active:scale-95 shadow-sm"
                  >
                    <CheckCircle2 size={13} />
                    <span>Mark Done</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-indigo-300/60 uppercase">
                    Upcoming
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
