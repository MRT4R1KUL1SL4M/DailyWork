import React, { useState } from 'react';
import { TaskItem } from '../types';
import { formatDateWithDay } from '../utils/date';
import { Calendar, ChevronLeft, ChevronRight, Plus, CheckCircle2, Clock, X, Target, Flame, Crown, Presentation, FlaskConical, Laptop, BookOpen, FileText, Code, Video, Edit3, Trash2 } from 'lucide-react';

interface PlannerTimelineProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddNewTaskWithDate: (dateStr: string) => void;
}

export const PlannerTimeline: React.FC<PlannerTimelineProps> = ({
  tasks,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddNewTaskWithDate
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [modalDate, setModalDate] = useState<string | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const formatDateStr = (d: number) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  const tasksByDateMap: Record<string, TaskItem[]> = {};
  tasks.forEach((t) => {
    if (!tasksByDateMap[t.dueDate]) {
      tasksByDateMap[t.dueDate] = [];
    }
    tasksByDateMap[t.dueDate].push(t);
  });

  const modalTasks = modalDate ? tasks.filter((t) => t.dueDate === modalDate) : [];

  const getTaskIcon = (task: TaskItem) => {
    switch (task.subCategory) {
      case 'ct': return <Target size={15} className="text-amber-400" />;
      case 'mt': return <Flame size={15} className="text-red-400" />;
      case 'final': return <Crown size={15} className="text-yellow-400" />;
      case 'presentation': return <Presentation size={15} className="text-violet-400" />;
      case 'lab_final': return <FlaskConical size={15} className="text-emerald-400" />;
      case 'lab_work': return <Laptop size={15} className="text-teal-400" />;
      case 'daily_study': return <BookOpen size={15} className="text-indigo-400" />;
      case 'code': return <Code size={15} className="text-emerald-400" />;
      case 'paper': return <FileText size={15} className="text-teal-400" />;
      case 'paper_read': return <FileText size={15} className="text-amber-400" />;
      case 'book_read': return <BookOpen size={15} className="text-amber-400" />;
      default: return <BookOpen size={15} className="text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900/60 border border-violet-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 mb-1">
            <Calendar size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">Overall 1-Month Planner & Scheduling Matrix</span>
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text-main)]">
            Interactive Monthly Calendar Matrix
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Click any calendar date cell to trigger an interactive Date Schedule Modal Popup.
          </p>
        </div>

        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            setModalDate(today);
          }}
          className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all shadow-md"
        >
          + Add Task for Today
        </button>
      </div>

      {/* 1-Month Calendar View Matrix */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4 border border-[var(--border-color)] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <h3 className="text-base font-extrabold text-[var(--text-main)]">
            {monthName}
          </h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => {
                setCurrentMonthDate(new Date());
              }}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* 7-Column Calendar Grid Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} className="h-28 rounded-2xl bg-transparent" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatDateStr(dayNum);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dateTasks = tasksByDateMap[dateStr] || [];

            return (
              <div
                key={dateStr}
                onClick={() => setModalDate(dateStr)}
                className={`h-28 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] shadow-sm ${
                  isToday
                    ? 'border-amber-500/60 bg-amber-950/20 ring-2 ring-amber-500/30'
                    : dateTasks.length > 0
                    ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-500/70'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-indigo-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        isToday ? 'bg-amber-500 text-black' : 'text-[var(--text-main)]'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dateTasks.length > 0 && (
                      <span className="text-[10px] font-black text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10">
                        {dateTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Compact Category Badges inside cell */}
                  {dateTasks.length > 0 && (
                    <div className="space-y-1">
                      {dateTasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className="text-[9px] font-extrabold truncate px-1.5 py-0.5 rounded bg-black/60 text-indigo-300 border border-white/10"
                        >
                          [{t.category.toUpperCase()}] {t.courseCode || t.title}
                        </div>
                      ))}
                      {dateTasks.length > 2 && (
                        <div className="text-[9px] text-indigo-400 font-extrabold pl-1">
                          +{dateTasks.length - 2} more...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {dateTasks.length === 0 && (
                  <div className="text-[9px] text-[var(--text-subtle)] opacity-40 font-semibold text-center">
                    + Add Task
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DATE TASKS SCHEDULE MODAL POPUP (Triggers on cell click) */}
      {modalDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto animate-in fade-in zoom-in duration-200">
          <div className="glass-card max-w-2xl w-full p-6 rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 via-[var(--glass-bg)] to-slate-900/90 shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
              <div>
                <h3 className="text-base font-black text-[var(--text-main)] flex items-center space-x-2">
                  <span>Scheduled Tasks for {formatDateWithDay(modalDate)}</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                  {modalTasks.filter((t) => t.status === 'completed').length} / {modalTasks.length} Tasks Completed
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAddNewTaskWithDate(modalDate)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md"
                >
                  + Add Task
                </button>
                <button
                  onClick={() => setModalDate(null)}
                  className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-color)]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Tasks List */}
            {modalTasks.length === 0 ? (
              <div className="text-center py-10 glass-card rounded-2xl border border-[var(--border-color)]">
                <Calendar size={40} className="mx-auto text-[var(--text-subtle)] mb-2 opacity-40" />
                <p className="text-sm font-bold text-[var(--text-muted)]">
                  No tasks scheduled for {formatDateWithDay(modalDate)}.
                </p>
                <button
                  onClick={() => onAddNewTaskWithDate(modalDate)}
                  className="mt-3 text-xs font-extrabold text-indigo-400 hover:underline"
                >
                  + Create a new task for this day
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {modalTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  const icon = getTaskIcon(task);

                  return (
                    <div
                      key={task.id}
                      className={`glass-card p-4 rounded-2xl flex flex-col justify-between border transition-all ${
                        isDone
                          ? 'opacity-60 bg-[var(--bg-surface)] border-[var(--border-color)]'
                          : 'bg-black/50 border-indigo-500/30 hover:border-indigo-500/60 shadow-md'
                      }`}
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="p-1 rounded-lg bg-black/40 border border-white/10">
                              {icon}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded badge-${task.category}`}>
                              {task.category}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded badge-${task.priority}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Course info */}
                        {(task.courseCode || task.courseName) && (
                          <div className="flex items-center space-x-2 my-1">
                            {task.courseCode && (
                              <span className="text-xs font-black text-indigo-300">
                                [{task.courseCode}]
                              </span>
                            )}
                            {task.courseName && (
                              <span className="text-xs font-bold text-[var(--text-muted)]">
                                {task.courseName}
                              </span>
                            )}
                          </div>
                        )}

                        <h4
                          onClick={() => {
                            setModalDate(null);
                            onEditTask(task);
                          }}
                          className={`font-extrabold text-sm cursor-pointer hover:text-indigo-400 transition-colors ${
                            isDone ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-main)]'
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Syllabus points */}
                        {task.syllabusPoints && task.syllabusPoints.length > 0 && (
                          <p className="text-xs text-amber-300 font-semibold mt-1">
                            📜 Syllabus: {task.syllabusPoints.join(', ')}
                          </p>
                        )}

                        {/* Topics list */}
                        {task.topicsList && task.topicsList.length > 0 && (
                          <p className="text-xs text-indigo-300 font-semibold mt-1">
                            📌 Topics: {task.topicsList.join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Action Footer */}
                      <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] flex items-center space-x-1">
                          <Clock size={12} className="text-indigo-400" />
                          <span>{task.dueTime || 'Anytime'}</span>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setModalDate(null);
                              onEditTask(task);
                            }}
                            className="p-1 text-[var(--text-muted)] hover:text-indigo-400"
                          >
                            <Edit3 size={15} />
                          </button>
                          {onDeleteTask && (
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1 text-[var(--text-muted)] hover:text-red-400"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => onToggleStatus(task.id)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-extrabold ${
                              isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            <CheckCircle2 size={14} />
                            <span>{isDone ? 'Done' : 'Mark Done'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex justify-end">
              <button
                onClick={() => setModalDate(null)}
                className="px-4 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
