import React, { useState } from 'react';
import { TaskItem, AcademicType } from '../types';
import { formatDateWithDay } from '../utils/date';
import { GraduationCap, Flame, Crown, Presentation, FlaskConical, Target, BookOpen, Laptop, Plus, CheckCircle2, Clock, Trash2, Edit3 } from 'lucide-react';

interface AcademicSectionProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  onAddNewAcademic: (subCategory: AcademicType) => void;
}

export const AcademicSection: React.FC<AcademicSectionProps> = ({
  tasks,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddNewAcademic
}) => {
  const [filterSubCat, setFilterSubCat] = useState<string>('all');

  const academicTasks = tasks.filter((t) => t.category === 'academic');
  const filtered = academicTasks.filter((t) => {
    if (filterSubCat === 'all') return true;
    return t.subCategory === filterSubCat;
  });

  const getContextualInfo = (subCat: string) => {
    switch (subCat) {
      case 'ct':
        return { label: 'Class Test (CT)', icon: <Target size={15} className="text-amber-400" />, cardStyle: 'border-amber-500/40 bg-amber-950/10' };
      case 'mt':
        return { label: 'Mid Term (MT)', icon: <Flame size={15} className="text-red-400" />, cardStyle: 'border-red-500/40 bg-red-950/10' };
      case 'final':
        return { label: 'Semester Final', icon: <Crown size={15} className="text-yellow-400" />, cardStyle: 'border-yellow-500/50 bg-yellow-950/10 font-serif' };
      case 'presentation':
        return { label: 'Presentation', icon: <Presentation size={15} className="text-violet-400" />, cardStyle: 'border-violet-500/40 bg-violet-950/10' };
      case 'lab_final':
        return { label: 'Lab Final', icon: <FlaskConical size={15} className="text-emerald-400" />, cardStyle: 'border-emerald-500/40 bg-emerald-950/10 font-mono' };
      case 'lab_work':
        return { label: 'Lab Work', icon: <Laptop size={15} className="text-teal-400" />, cardStyle: 'border-teal-500/40 bg-teal-950/10 font-mono' };
      default:
        return { label: 'Daily Study', icon: <BookOpen size={15} className="text-indigo-400" />, cardStyle: 'border-indigo-500/40 bg-indigo-950/10' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-1">
              <GraduationCap size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">Academic System</span>
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-main)]">
              Class Tests, Mid Terms, Semester Finals, Presentations & Daily Studies
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Built-in preset titles, point-by-point syllabus breakdown, and topic trackers per course.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onAddNewAcademic('daily_study')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>+ Daily Study</span>
            </button>
            <button
              onClick={() => onAddNewAcademic('ct')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>+ CT</span>
            </button>
            <button
              onClick={() => onAddNewAcademic('mt')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>+ MT</span>
            </button>
            <button
              onClick={() => onAddNewAcademic('final')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>+ Semester Final</span>
            </button>
            <button
              onClick={() => onAddNewAcademic('presentation')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus size={14} />
              <span>+ Presentation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center space-x-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: `All (${academicTasks.length})` },
          { id: 'daily_study', label: 'Daily Class Study' },
          { id: 'ct', label: 'CT (Class Test)' },
          { id: 'mt', label: 'Mid Term (MT)' },
          { id: 'final', label: 'Semester Final' },
          { id: 'presentation', label: 'Presentation' },
          { id: 'lab_work', label: 'Lab Work' },
          { id: 'lab_final', label: 'Lab Final' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterSubCat(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filterSubCat === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <GraduationCap size={40} className="mx-auto text-[var(--text-subtle)] mb-2 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">No academic items in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((task) => {
            const isDone = task.status === 'completed';
            const context = getContextualInfo(task.subCategory);

            return (
              <div
                key={task.id}
                className={`glass-card p-5 rounded-2xl flex flex-col justify-between transition-all border ${
                  isDone ? 'opacity-60 bg-[var(--bg-surface)] border-[var(--border-color)]' : context.cardStyle
                }`}
              >
                <div>
                  {/* Category Badge & Priority */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10">
                      {context.icon}
                      <span className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-wide">
                        {context.label}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Course Code & Name */}
                  {(task.courseCode || task.courseName) && (
                    <div className="flex items-center space-x-2 my-2">
                      {task.courseCode && (
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                          {task.courseCode}
                        </span>
                      )}
                      {task.courseName && (
                        <span className="text-xs font-bold text-[var(--text-muted)]">
                          {task.courseName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    onClick={() => onEditTask(task)}
                    className={`font-extrabold text-base cursor-pointer hover:text-indigo-400 transition-colors mt-1 ${
                      isDone ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-main)]'
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Syllabus Bullet Points */}
                  {task.syllabusPoints && task.syllabusPoints.length > 0 && (
                    <div className="mt-3 bg-black/40 p-3 rounded-xl border border-amber-500/20 space-y-1">
                      <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Syllabus (Point-by-Point):</p>
                      {task.syllabusPoints.map((point, idx) => (
                        <div key={idx} className="text-xs text-[var(--text-main)] font-medium flex items-start space-x-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multi-Topics List (Topic 1, Topic 2...) */}
                  {task.topicsList && task.topicsList.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Topics to Cover:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {task.topicsList.map((top, idx) => (
                          <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            📌 {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center space-x-1">
                    <Clock size={12} className="text-indigo-400" />
                    <span>{formatDateWithDay(task.dueDate)}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEditTask(task)} className="p-1.5 text-[var(--text-muted)] hover:text-indigo-400">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} className="p-1.5 text-[var(--text-muted)] hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
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
    </div>
  );
};
