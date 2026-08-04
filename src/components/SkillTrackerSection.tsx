import React, { useState } from 'react';
import { TaskItem, SkillCourse } from '../types';
import { formatDateWithDay } from '../utils/date';
import { TrendingUp, Plus, Video, FileText, CheckCircle2, Trash2, Edit3, Clock } from 'lucide-react';

interface SkillTrackerSectionProps {
  courses: SkillCourse[];
  tasks?: TaskItem[];
  onAddCourse: (course: Omit<SkillCourse, 'id' | 'updatedAt'>) => void;
  onUpdateCourse: (course: SkillCourse) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddNewSkillTask?: () => void;
}

export const SkillTrackerSection: React.FC<SkillTrackerSectionProps> = ({
  courses,
  tasks = [],
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddNewSkillTask
}) => {
  const skillTasks = tasks.filter((t) => t.category === 'skill');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900/60 border border-pink-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-pink-400 mb-1">
              <TrendingUp size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">Skill Growup Tracker</span>
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-main)]">
              Video Series & Document / Book Learning Targets
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Track how many videos to watch or how many pages to read for your personal skills.
            </p>
          </div>

          <button
            onClick={onAddNewSkillTask}
            className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs shadow-md transition-all"
          >
            <Plus size={16} />
            <span>+ Add Skill Task</span>
          </button>
        </div>
      </div>

      {/* Skill Tasks Grid */}
      {skillTasks.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <TrendingUp size={40} className="mx-auto text-[var(--text-subtle)] mb-2 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">No skill tasks added yet.</p>
          <button
            onClick={onAddNewSkillTask}
            className="mt-3 px-4 py-2 text-xs font-bold text-pink-400 bg-pink-500/10 rounded-xl border border-pink-500/20"
          >
            + Add your custom skill target (Django, Excel, etc.)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isVideo = task.skillResourceFormat === 'video';

            return (
              <div
                key={task.id}
                className={`glass-card p-5 rounded-2xl flex flex-col justify-between transition-all border ${
                  isDone ? 'opacity-60 bg-[var(--bg-surface)] border-[var(--border-color)]' : 'border-pink-500/30 hover:border-pink-500/60 bg-pink-950/10 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-extrabold uppercase">
                      {isVideo ? <Video size={14} /> : <FileText size={14} />}
                      <span>{isVideo ? 'Video Format' : 'Document / Book'}</span>
                    </span>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[var(--text-main)] mb-1">
                    {task.title}
                  </h3>

                  {task.skillTargetAmount && (
                    <div className="mt-2 text-xs font-extrabold text-pink-300 bg-black/40 p-2.5 rounded-xl border border-pink-500/25">
                      {isVideo ? '📹 Target Video Count / Time: ' : '📄 Target Page Count / Chapters: '}
                      <span className="text-white font-bold">{task.skillTargetAmount}</span>
                    </div>
                  )}

                  {task.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium flex items-center space-x-1">
                    <Clock size={12} className="text-pink-400" />
                    <span>{formatDateWithDay(task.dueDate)}</span>
                  </span>

                  <button
                    onClick={() => {
                      if (onAddNewSkillTask) onAddNewSkillTask();
                    }}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                      isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>{isDone ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
