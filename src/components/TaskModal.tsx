import React, { useState, useEffect } from 'react';
import { TaskItem, CategoryType, SubCategoryType, PriorityType } from '../types';
import { X, Calendar, Plus, Trash2, Video, FileText } from 'lucide-react';

import { getLocalDateStr } from '../utils/date';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<TaskItem, 'id' | 'createdAt'> & { id?: string }) => void;
  editingTask?: TaskItem | null;
  defaultCategory?: CategoryType;
  defaultSubCategory?: SubCategoryType;
  defaultDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  editingTask,
  defaultCategory = 'academic',
  defaultSubCategory = 'ct',
  defaultDate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [subCategory, setSubCategory] = useState<SubCategoryType>(defaultSubCategory);
  const [priority, setPriority] = useState<PriorityType>('high');
  const [dueDate, setDueDate] = useState(defaultDate || getLocalDateStr());
  const [dueTime, setDueTime] = useState('');
  
  // Academic specific fields
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [syllabusPoints, setSyllabusPoints] = useState<string[]>([]);
  const [newSyllabusInput, setNewSyllabusInput] = useState('');
  const [topicsList, setTopicsList] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState('');

  // Research specific fields
  const [codeDetails, setCodeDetails] = useState('');
  const [paperPart, setPaperPart] = useState('');

  // Skill Growup specific fields
  const [skillResourceFormat, setSkillResourceFormat] = useState<'video' | 'document'>('video');
  const [skillTargetAmount, setSkillTargetAmount] = useState('5 Videos');

  // General specific fields
  const [generalTargetCount, setGeneralTargetCount] = useState('2 Papers');

  const getInbuiltTitle = (cat: CategoryType, subCat: string): string => {
    if (cat === 'academic') {
      switch (subCat) {
        case 'ct': return 'Class Test';
        case 'mt': return 'Mid Term';
        case 'final': return 'Semester Final';
        case 'presentation': return 'Presentation';
        case 'lab_final': return 'Lab Final';
        case 'lab_work': return 'Lab Work';
        case 'daily_study': return 'Daily Study';
        default: return '';
      }
    } else if (cat === 'research') {
      switch (subCat) {
        case 'code': return 'Code Modifications';
        case 'paper': return 'Paper Writing';
        default: return 'Research Task';
      }
    } else if (cat === 'general') {
      switch (subCat) {
        case 'paper_read': return 'Paper Read';
        case 'book_read': return 'Book Read';
        default: return 'General Read';
      }
    }
    return '';
  };

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setSubCategory(editingTask.subCategory);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '');
      setCourseCode(editingTask.courseCode || '');
      setCourseName(editingTask.courseName || '');
      setSyllabusPoints(editingTask.syllabusPoints || []);
      setTopicsList(editingTask.topicsList || []);
      setCodeDetails(editingTask.codeDetails || '');
      setPaperPart(editingTask.paperPart || '');
      setSkillResourceFormat(editingTask.skillResourceFormat || 'video');
      setSkillTargetAmount(editingTask.skillTargetAmount || '5 Videos');
      setGeneralTargetCount(editingTask.generalTargetCount || '2 Papers');
    } else {
      setCategory(defaultCategory);
      setSubCategory(defaultSubCategory);
      setTitle(getInbuiltTitle(defaultCategory, defaultSubCategory));
      setDescription('');
      
      if (defaultCategory === 'general') {
        setPriority('medium');
      } else if (['ct', 'mt', 'final', 'presentation', 'lab_final'].includes(defaultSubCategory)) {
        setPriority('urgent');
      } else {
        setPriority('high');
      }

      setDueDate(defaultDate || getLocalDateStr());
      setDueTime('');
      setCourseCode('');
      setCourseName('');
      setSyllabusPoints([]);
      setTopicsList([]);
      setCodeDetails('');
      setPaperPart('');
      setSkillResourceFormat('video');
      setSkillTargetAmount('5 Videos');
      setGeneralTargetCount('2 Papers');
    }
  }, [editingTask, isOpen, defaultCategory, defaultSubCategory, defaultDate]);

  if (!isOpen) return null;

  const handleAddSyllabusPoint = () => {
    if (!newSyllabusInput.trim()) return;
    setSyllabusPoints([...syllabusPoints, newSyllabusInput.trim()]);
    setNewSyllabusInput('');
  };

  const handleRemoveSyllabusPoint = (index: number) => {
    setSyllabusPoints(syllabusPoints.filter((_, i) => i !== index));
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    setTopicsList([...topicsList, newTopicInput.trim()]);
    setNewTopicInput('');
  };

  const handleRemoveTopic = (index: number) => {
    setTopicsList(topicsList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalTitle = title.trim();
    if (!finalTitle) {
      finalTitle = getInbuiltTitle(category, subCategory) || 'New Plan';
    }

    onSaveTask({
      id: editingTask?.id,
      title: finalTitle,
      description: description.trim(),
      category,
      subCategory,
      priority,
      dueDate,
      dueTime,
      courseCode: courseCode.trim(),
      courseName: courseName.trim(),
      syllabusPoints,
      topicsList,
      codeDetails: codeDetails.trim(),
      paperPart: paperPart.trim(),
      skillResourceFormat: category === 'skill' ? skillResourceFormat : undefined,
      skillTargetAmount: category === 'skill' ? skillTargetAmount.trim() : undefined,
      generalTargetCount: category === 'general' ? generalTargetCount.trim() : undefined,
      status: editingTask?.status || 'pending'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
      <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-4">
          <h3 className="text-base font-black text-[var(--text-main)]">
            {editingTask ? 'Edit Task' : '+ Add New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Main Category & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as CategoryType;
                  setCategory(newCat);
                  if (newCat === 'academic') {
                    setSubCategory('ct');
                    setTitle('Class Test');
                    setPriority('urgent');
                  } else if (newCat === 'research') {
                    setSubCategory('code');
                    setTitle('Code Modifications');
                    setPriority('high');
                  } else if (newCat === 'skill') {
                    setSubCategory('general');
                    setTitle('');
                    setPriority('high');
                  } else {
                    setSubCategory('paper_read');
                    setTitle('Paper Read');
                    setPriority('medium');
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500 font-bold"
              >
                <option value="academic">🎓 Academic</option>
                <option value="research">🔬 Research Lab</option>
                <option value="skill">💻 Skill Growup</option>
                <option value="general">⚡ General (Reading)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase">
                Type
              </label>
              {category === 'academic' ? (
                <select
                  value={subCategory}
                  onChange={(e) => {
                    const newSubCat = e.target.value as SubCategoryType;
                    setSubCategory(newSubCat);
                    setTitle(getInbuiltTitle('academic', newSubCat));
                    if (['ct', 'mt', 'final', 'presentation', 'lab_final'].includes(newSubCat)) {
                      setPriority('urgent');
                    } else {
                      setPriority('high');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="ct">🏆 CT (Class Test)</option>
                  <option value="mt">🚩 MT (Mid Term)</option>
                  <option value="final">🎯 Semester Final</option>
                  <option value="presentation">📊 Presentation</option>
                  <option value="lab_final">🔬 Lab Final</option>
                  <option value="lab_work">🧪 Lab Work</option>
                  <option value="daily_study">📖 Daily Study</option>
                </select>
              ) : category === 'research' ? (
                <select
                  value={subCategory}
                  onChange={(e) => {
                    const newSubCat = e.target.value as SubCategoryType;
                    setSubCategory(newSubCat);
                    setTitle(getInbuiltTitle('research', newSubCat));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="code">💻 Code Modifications</option>
                  <option value="paper">📄 Paper Writing</option>
                </select>
              ) : category === 'general' ? (
                <select
                  value={subCategory}
                  onChange={(e) => {
                    const newSubCat = e.target.value as SubCategoryType;
                    setSubCategory(newSubCat);
                    setTitle(getInbuiltTitle('general', newSubCat));
                    setPriority('medium');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="paper_read">📄 Paper Read</option>
                  <option value="book_read">📚 Book Read</option>
                </select>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] font-bold">
                  Skill Learning
                </div>
              )}
            </div>
          </div>

          {/* Academic Specific Fields */}
          {category === 'academic' && (
            <div className="space-y-3 bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-indigo-300 mb-1 uppercase">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE 301"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-indigo-300 mb-1 uppercase">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Algorithms"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {['mt', 'final', 'lab_final'].includes(subCategory) && (
                <div>
                  <label className="block text-xs font-extrabold text-amber-300 mb-1 uppercase">
                    Syllabus Topics (Point-by-Point)
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add syllabus point..."
                      value={newSyllabusInput}
                      onChange={(e) => setNewSyllabusInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSyllabusPoint();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSyllabusPoint}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {syllabusPoints.length > 0 && (
                    <div className="space-y-1 bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-color)] max-h-32 overflow-y-auto">
                      {syllabusPoints.map((pt, i) => (
                        <div key={i} className="flex items-center justify-between text-xs px-2.5 py-1 bg-[var(--bg-surface-hover)] rounded-lg">
                          <span className="text-[var(--text-main)] font-medium">• {pt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSyllabusPoint(i)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {['daily_study', 'lab_work', 'ct', 'presentation'].includes(subCategory) && (
                <div>
                  <label className="block text-xs font-extrabold text-indigo-300 mb-1 uppercase">
                    Topics to Cover (Add Topic 1, Topic 2...)
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add topic..."
                      value={newTopicInput}
                      onChange={(e) => setNewTopicInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {topicsList.length > 0 && (
                    <div className="space-y-1 bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-color)] max-h-32 overflow-y-auto">
                      {topicsList.map((top, i) => (
                        <div key={i} className="flex items-center justify-between text-xs px-2.5 py-1 bg-[var(--bg-surface-hover)] rounded-lg">
                          <span className="text-[var(--text-main)] font-semibold">📌 {top}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(i)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Research Specific Fields */}
          {category === 'research' && (
            <div className="space-y-3 bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
              {subCategory === 'code' ? (
                <div>
                  <label className="block text-xs font-extrabold text-emerald-300 mb-1 uppercase">
                    Code Modifications (What to edit, add, or modify) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Add dataset image normalization & loss evaluation loop in train_model.py"
                    value={codeDetails}
                    onChange={(e) => setCodeDetails(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-extrabold text-teal-300 mb-1 uppercase">
                    Paper Section to Write *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section 3: Methodology & Proposed Architecture"
                    value={paperPart}
                    onChange={(e) => setPaperPart(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Skill Growup Specific Fields */}
          {category === 'skill' && (
            <div className="space-y-3 bg-pink-500/10 p-3.5 rounded-2xl border border-pink-500/20">
              <div>
                <label className="block text-xs font-extrabold text-pink-300 mb-1 uppercase">
                  Skill Format
                </label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-1.5 text-xs font-bold text-[var(--text-main)] cursor-pointer">
                    <input
                      type="radio"
                      name="skillFormat"
                      value="video"
                      checked={skillResourceFormat === 'video'}
                      onChange={() => {
                        setSkillResourceFormat('video');
                        setSkillTargetAmount('5 Videos');
                      }}
                      className="accent-pink-600"
                    />
                    <Video size={14} className="text-pink-400" />
                    <span>Video Series</span>
                  </label>

                  <label className="flex items-center space-x-1.5 text-xs font-bold text-[var(--text-main)] cursor-pointer">
                    <input
                      type="radio"
                      name="skillFormat"
                      value="document"
                      checked={skillResourceFormat === 'document'}
                      onChange={() => {
                        setSkillResourceFormat('document');
                        setSkillTargetAmount('20 Pages');
                      }}
                      className="accent-pink-600"
                    />
                    <FileText size={14} className="text-pink-400" />
                    <span>Document / Book</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-pink-300 mb-1 uppercase">
                  {skillResourceFormat === 'video' ? 'Video Count / Time Duration' : 'Page Count / Chapters'}
                </label>
                <input
                  type="text"
                  placeholder={skillResourceFormat === 'video' ? 'e.g. 5 Videos or 1.5 Hours' : 'e.g. 20 Pages or Chapter 3'}
                  value={skillTargetAmount}
                  onChange={(e) => setSkillTargetAmount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* General Specific Fields */}
          {category === 'general' && (
            <div className="bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20">
              <label className="block text-xs font-extrabold text-amber-300 mb-1 uppercase">
                {subCategory === 'paper_read' ? 'How Many Papers to Read?' : 'How Many Books to Read?'}
              </label>
              <input
                type="text"
                placeholder={subCategory === 'paper_read' ? 'e.g. 2 Papers' : 'e.g. 1 Book or Chapter 4'}
                value={generalTargetCount}
                onChange={(e) => setGeneralTargetCount(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-black text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Details / Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase">
              Extra Work Details
            </label>
            <textarea
              rows={2}
              placeholder="Add key notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase flex items-center space-x-1">
                <Calendar size={12} />
                <span>Date *</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-1 uppercase">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityType)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-indigo-500 font-bold"
              >
                <option value="urgent">🚨 Urgent (Auto Alert Banner)</option>
                <option value="high">⚡ High Priority</option>
                <option value="medium">🔹 Medium Priority</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
