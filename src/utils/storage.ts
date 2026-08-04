import { AppData } from '../types';
import { getLocalDateStr } from './date';

const STORAGE_KEY = 'DAILYWORK_PERSONAL_NOTEBOOK_PROD_V1';

const INITIAL_EMPTY_DATA: AppData = {
  version: '6.0.0',
  tasks: [],
  courses: [],
  courseLogs: []
};

export const loadAppData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let appData: AppData = raw ? JSON.parse(raw) : INITIAL_EMPTY_DATA;

    if (!appData.tasks) appData.tasks = [];
    if (!appData.courses) appData.courses = [];
    if (!appData.courseLogs) appData.courseLogs = [];

    // AUTO MARK DONE FOR PAST OVERDUE TASKS (dueDate < todayStr in Local Timezone)
    const todayStr = getLocalDateStr();
    let hasOverdueUpdate = false;

    appData.tasks = appData.tasks.map((t) => {
      if (t.dueDate < todayStr && t.status !== 'completed') {
        hasOverdueUpdate = true;
        return { ...t, status: 'completed' };
      }
      return t;
    });

    if (hasOverdueUpdate) {
      saveAppData(appData);
    }

    return appData;
  } catch (err) {
    console.error('Failed to load storage:', err);
    return INITIAL_EMPTY_DATA;
  }
};

export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save storage:', err);
  }
};

export const resetToEmptyData = (): AppData => {
  saveAppData(INITIAL_EMPTY_DATA);
  return INITIAL_EMPTY_DATA;
};
