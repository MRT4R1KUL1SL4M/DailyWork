import React, { useState } from 'react';
import { TaskItem, ResearchType } from '../types';
import { formatDateWithDay } from '../utils/date';
import { Microscope, FileText, Code, Plus, CheckCircle2, Clock, Trash2, Edit3, Terminal } from 'lucide-react';

interface ResearchSectionProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  onAddNewResearch: (subCategory: ResearchType) => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  tasks,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddNewResearch
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const researchTasks = tasks.filter((t) => t.category === 'research');
  const filtered = researchTasks.filter((t) => {
    if (filterType === 'all') return true;
    return t.subCategory === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/60 border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Microscope size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">Research & Development Lab</span>
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-main)]">
              Code Modifications & Paper Writing
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Track what code to write/edit and which section of your paper to write.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onAddNewResearch('code')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md"
            >
              <Plus size={15} />
              <span>+ Code Task</span>
            </button>
            <button
              onClick={() => onAddNewResearch('paper')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold transition-all shadow-md"
            >
              <Plus size={15} />
              <span>+ Paper Writing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)] w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
            filterType === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          All Research ({researchTasks.length})
        </button>
        <button
          onClick={() => setFilterType('code')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
            filterType === 'code' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          💻 Code Modifications
        </button>
        <button
          onClick={() => setFilterType('paper')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
            filterType === 'paper' ? 'bg-teal-600 text-white shadow-sm' : 'text-[var(--text-muted)]'
          }`}
        >
          📄 Paper Writing
        </button>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <Microscope size={40} className="mx-auto text-[var(--text-subtle)] mb-2 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">No research items in this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((task) => {
            const isDone = task.status === 'completed';

            /* CODE MODIFICATION CARD (IDE Terminal Style) */
            if (task.subCategory === 'code') {
              return (
                <div
                  key={task.id}
                  className={`glass-card p-5 rounded-2xl border transition-all ${
                    isDone ? 'opacity-60 bg-[var(--bg-surface)] border-[var(--border-color)]' : 'border-emerald-500/40 bg-black/60 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <Terminal size={15} />
                      <span>~/research/code_modification.py</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <h3
                    onClick={() => onEditTask(task)}
                    className="font-black text-base text-[var(--text-main)] hover:text-emerald-400 cursor-pointer font-mono"
                  >
                    $ {task.title}
                  </h3>

                  {task.codeDetails && (
                    <div className="mt-2 text-xs font-mono text-emerald-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                      <strong>Code Edits & Modifications:</strong>
                      <p className="mt-1 leading-relaxed">{task.codeDetails}</p>
                    </div>
                  )}

                  {task.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 font-sans">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center space-x-1 font-sans font-medium">
                      <Clock size={12} className="text-emerald-400" />
                      <span>{formatDateWithDay(task.dueDate)}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button onClick={() => onEditTask(task)} className="p-1 text-[var(--text-muted)] hover:text-emerald-400">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => onDeleteTask(task.id)} className="p-1 text-[var(--text-muted)] hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => onToggleStatus(task.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold ${isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                      >
                        {isDone ? 'Done' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            /* PAPER WRITING CARD (Document Editor Style) */
            return (
              <div
                key={task.id}
                className={`glass-card p-5 rounded-2xl border transition-all ${
                  isDone ? 'opacity-60 bg-[var(--bg-surface)] border-[var(--border-color)]' : 'border-teal-500/40 bg-teal-950/10 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-extrabold uppercase">
                    <FileText size={14} />
                    <span>Paper Writing</span>
                  </span>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded badge-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>

                <h3
                  onClick={() => onEditTask(task)}
                  className="font-extrabold text-base text-[var(--text-main)] hover:text-teal-400 cursor-pointer"
                >
                  📄 {task.title}
                </h3>

                {task.paperPart && (
                  <div className="mt-2 text-xs font-semibold text-teal-200 bg-black/40 p-2.5 rounded-xl border border-teal-500/25">
                    <strong>Part/Section to Write:</strong>
                    <p className="mt-0.5">{task.paperPart}</p>
                  </div>
                )}

                {task.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center space-x-1 font-medium">
                    <Clock size={12} className="text-teal-400" />
                    <span>{formatDateWithDay(task.dueDate)}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEditTask(task)} className="p-1 text-[var(--text-muted)] hover:text-teal-400">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} className="p-1 text-[var(--text-muted)] hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold ${isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-600 hover:bg-teal-500 text-white'}`}
                    >
                      {isDone ? 'Done' : 'Mark Done'}
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
