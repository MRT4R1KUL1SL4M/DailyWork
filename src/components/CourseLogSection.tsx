import React, { useState } from 'react';
import { CourseLogItem, CourseTopicItem } from '../types';
import {
  BookMarked,
  Plus,
  CheckCircle2,
  Trash2,
  BookOpen,
  FlaskConical,
  X,
  GraduationCap,
  Sparkles,
  ListChecks,
  BookmarkCheck,
  Tag,
  Layers
} from 'lucide-react';

interface CourseLogSectionProps {
  courseLogs: CourseLogItem[];
  onAddCourseLog: (course: Omit<CourseLogItem, 'id' | 'createdAt'>) => void;
  onUpdateCourseLog: (course: CourseLogItem) => void;
  onDeleteCourseLog: (courseId: string) => void;
}

export const CourseLogSection: React.FC<CourseLogSectionProps> = ({
  courseLogs,
  onAddCourseLog,
  onUpdateCourseLog,
  onDeleteCourseLog
}) => {
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseCodeInput, setCourseCodeInput] = useState('');
  const [courseNameInput, setCourseNameInput] = useState('');
  const [courseTypeInput, setCourseTypeInput] = useState<'theory' | 'lab'>('theory');

  // New topic inputs per course card map: { [courseId]: string }
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>({});

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCodeInput.trim() || !courseNameInput.trim()) return;

    onAddCourseLog({
      courseCode: courseCodeInput.trim().toUpperCase(),
      courseName: courseNameInput.trim(),
      courseType: courseTypeInput,
      topics: []
    });

    setCourseCodeInput('');
    setCourseNameInput('');
    setCourseTypeInput('theory');
    setIsAddCourseModalOpen(false);
  };

  const handleAddTopicToCourse = (course: CourseLogItem) => {
    const topicText = (newTopicInputs[course.id] || '').trim();
    if (!topicText) return;

    const newTopic: CourseTopicItem = {
      id: 'top-' + Date.now(),
      title: topicText,
      completed: false
    };

    onUpdateCourseLog({
      ...course,
      topics: [...course.topics, newTopic]
    });

    setNewTopicInputs((prev) => ({ ...prev, [course.id]: '' }));
  };

  const handleToggleTopicStatus = (course: CourseLogItem, topicId: string) => {
    const updatedTopics = course.topics.map((t) =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );

    onUpdateCourseLog({
      ...course,
      topics: updatedTopics
    });
  };

  const handleDeleteTopic = (course: CourseLogItem, topicId: string) => {
    const updatedTopics = course.topics.filter((t) => t.id !== topicId);
    onUpdateCourseLog({
      ...course,
      topics: updatedTopics
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/90 to-purple-950/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-3.5 z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-slate-900 text-white shadow-xl shadow-indigo-500/30 border border-white/10">
            <BookMarked size={26} className="text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-main)]">
                Class Tracker
              </h2>
              <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm flex items-center space-x-1">
                <GraduationCap size={13} />
                <span>Semester Course Syllabus Log</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
              Log & track all topics taught per course over the semester.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddCourseModalOpen(true)}
          className="flex items-center space-x-2 px-4.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 shrink-0 z-10"
        >
          <Plus size={16} />
          <span>+ Add Semester Course</span>
        </button>
      </div>

      {/* Course Cards Grid */}
      {courseLogs.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl border border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-primary)]">
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 w-16 h-16 mx-auto mb-3 flex items-center justify-center border border-indigo-500/20">
            <BookMarked size={32} />
          </div>
          <p className="text-sm font-bold text-[var(--text-muted)]">
            No semester courses added yet.
          </p>
          <p className="text-xs text-[var(--text-subtle)] mt-1 max-w-sm mx-auto">
            Add your semester theory and lab courses (e.g. CSE 301 - Algorithms) to log topics taught in class.
          </p>
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md transition-all"
          >
            <Plus size={14} />
            <span>Add Course</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseLogs.map((course) => {
            const completedCount = course.topics.filter((t) => t.completed).length;
            const totalCount = course.topics.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isLab = course.courseType === 'lab';

            return (
              <div
                key={course.id}
                className={`glass-card p-6 rounded-3xl border transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5 ${
                  isLab
                    ? 'border-teal-500/30 bg-gradient-to-b from-teal-950/20 via-[var(--bg-surface)] to-slate-900/80 hover:border-teal-500/60 shadow-teal-500/10'
                    : 'border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-[var(--bg-surface)] to-slate-900/80 hover:border-indigo-500/60 shadow-indigo-500/10'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)]">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-black/60 text-indigo-300 border border-indigo-500/40 shadow-sm flex items-center space-x-1">
                          <Tag size={11} className="text-indigo-400" />
                          <span>{course.courseCode}</span>
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center space-x-1 shadow-sm ${
                            isLab
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          {isLab ? <FlaskConical size={11} className="text-teal-300" /> : <BookOpen size={11} className="text-purple-300" />}
                          <span>{isLab ? 'Lab Course' : 'Theory Course'}</span>
                        </span>
                      </div>

                      <h3 className="font-black text-lg text-[var(--text-main)] pt-1 flex items-center space-x-2">
                        <span>{course.courseName}</span>
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete course ${course.courseCode}?`)) {
                          onDeleteCourseLog(course.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Course Progress Stats Bar */}
                  {totalCount > 0 && (
                    <div className="my-3.5 p-3 rounded-2xl bg-black/40 border border-[var(--border-color)] space-y-1.5">
                      <div className="flex justify-between text-xs font-extrabold">
                        <span className="text-[var(--text-muted)] flex items-center space-x-1">
                          <ListChecks size={13} className="text-indigo-400" />
                          <span>Syllabus Completion:</span>
                        </span>
                        <span className={isLab ? 'text-teal-300' : 'text-indigo-300'}>
                          {completedCount}/{totalCount} Topics ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLab
                              ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400'
                              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Add Topic Input Bar */}
                  <div className="my-4">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-400">
                          <BookmarkCheck size={14} />
                        </div>
                        <input
                          type="text"
                          value={newTopicInputs[course.id] || ''}
                          onChange={(e) =>
                            setNewTopicInputs({ ...newTopicInputs, [course.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTopicToCourse(course);
                          }}
                          placeholder="+ Add topic taught in class..."
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                        />
                      </div>
                      <button
                        onClick={() => handleAddTopicToCourse(course)}
                        className={`px-4 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-md transition-all shrink-0 active:scale-95 ${
                          isLab
                            ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                        }`}
                      >
                        Add Topic
                      </button>
                    </div>
                  </div>

                  {/* Taught Topics Pill List */}
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider flex items-center space-x-1">
                        <Layers size={13} className="text-indigo-400" />
                        <span>Topics Taught in Class:</span>
                      </p>
                      <span className="text-[10px] text-gray-500 font-bold">
                        {totalCount} Logged
                      </span>
                    </div>

                    {course.topics.length === 0 ? (
                      <div className="text-center py-4 px-3 rounded-2xl bg-black/30 border border-dashed border-gray-800">
                        <p className="text-xs text-[var(--text-subtle)] font-medium">
                          No topics logged yet. Type a topic above to log what was taught in class.
                        </p>
                      </div>
                    ) : (
                      course.topics.map((topic, idx) => (
                        <div
                          key={topic.id}
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                            topic.completed
                              ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70'
                              : 'bg-black/60 border-[var(--border-color)] hover:border-indigo-500/40 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate pr-2">
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black/40 text-gray-400 border border-white/5 shrink-0">
                              #{idx + 1}
                            </span>
                            <span
                              className={`text-xs font-extrabold truncate ${
                                topic.completed ? 'line-through text-emerald-300/80' : 'text-[var(--text-main)]'
                              }`}
                            >
                              {topic.title}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => handleToggleTopicStatus(course, topic.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                                topic.completed
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                              }`}
                            >
                              <CheckCircle2 size={13} />
                              <span>{topic.completed ? 'Done' : 'Mark Done'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTopic(course, topic.id)}
                              className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete Topic"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 sm:p-7 rounded-3xl border border-indigo-500/40 shadow-2xl relative bg-gradient-to-b from-indigo-950/30 via-slate-900 to-slate-950">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
              <h3 className="text-base font-black text-[var(--text-main)] flex items-center space-x-2">
                <BookMarked size={20} className="text-indigo-400" />
                <span>Add Semester Course</span>
              </h3>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE 301"
                  value={courseCodeInput}
                  onChange={(e) => setCourseCodeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={courseNameInput}
                  onChange={(e) => setCourseNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Course Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCourseTypeInput('theory')}
                    className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center space-x-1.5 ${
                      courseTypeInput === 'theory'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25'
                        : 'bg-black/40 text-gray-400 border-[var(--border-color)]'
                    }`}
                  >
                    <BookOpen size={14} />
                    <span>Theory Course</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseTypeInput('lab')}
                    className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center space-x-1.5 ${
                      courseTypeInput === 'lab'
                        ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-500/25'
                        : 'bg-black/40 text-gray-400 border-[var(--border-color)]'
                    }`}
                  >
                    <FlaskConical size={14} />
                    <span>Lab Course</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white shadow-md shadow-indigo-500/20"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
