export type CategoryType = 'academic' | 'research' | 'skill' | 'general';

export type AcademicType =
  | 'daily_study'
  | 'ct'
  | 'mt'
  | 'final'
  | 'presentation'
  | 'lab_work'
  | 'lab_final';

export type ResearchType = 'code' | 'paper';
export type GeneralType = 'paper_read' | 'book_read';

export type SubCategoryType = AcademicType | ResearchType | GeneralType | 'general';

export type PriorityType = 'urgent' | 'high' | 'medium';
export type StatusType = 'pending' | 'in_progress' | 'completed';
export type TabType = 'dashboard' | 'academic' | 'research' | 'skills' | 'planner' | 'course_log';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  subCategory: SubCategoryType;
  priority: PriorityType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  status: StatusType;
  
  // Academic specific fields
  courseCode?: string;
  courseName?: string;
  syllabusPoints?: string[];
  topicsList?: string[];

  // Research specific fields
  codeDetails?: string;
  paperPart?: string;

  // Skill Growup specific fields
  skillResourceFormat?: 'video' | 'document';
  skillTargetAmount?: string;

  // General specific fields
  generalTargetCount?: string;

  createdAt: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  category: string;
  format: 'video' | 'document';
  targetAmount: string;
  watchedVideos: number;
  notes?: string;
  updatedAt: string;
}

export interface CourseTopicItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface CourseLogItem {
  id: string;
  courseCode: string;
  courseName: string;
  courseType: 'theory' | 'lab';
  topics: CourseTopicItem[];
  createdAt: string;
}

export interface AppData {
  tasks: TaskItem[];
  courses: SkillCourse[];
  courseLogs?: CourseLogItem[];
  version: string;
}
