import React, { useRef } from 'react';
import { TabType } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  Microscope,
  TrendingUp,
  Calendar,
  BookMarked,
  Plus,
  Moon,
  Sun,
  Feather,
  Lock,
  Download,
  Upload,
  Cloud,
  CloudOff,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export type SyncStatusType = 'synced' | 'syncing' | 'error' | 'disabled';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenTaskModal: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onLockApp?: () => void;
  onExportData?: () => void;
  onImportData?: (file: File) => void;
  syncStatus?: SyncStatusType;
  onShowFirebaseInfo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTaskModal,
  isDark,
  setIsDark,
  onLockApp,
  onExportData,
  onImportData,
  syncStatus = 'synced',
  onShowFirebaseInfo
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'academic', label: 'Academic', icon: <GraduationCap size={17} /> },
    { id: 'research', label: 'Research', icon: <Microscope size={17} /> },
    { id: 'skills', label: 'Skill Growup', icon: <TrendingUp size={17} /> },
    { id: 'planner', label: 'Monthly Planner', icon: <Calendar size={17} /> },
    { id: 'course_log', label: 'Class Tracker', icon: <BookMarked size={17} /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportData) {
      onImportData(file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-slate-900 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 border border-white/10">
              <Feather size={18} className="text-indigo-200" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                Daily Reflections
              </h1>
              <p className="text-[10px] text-indigo-300 font-medium tracking-wide hidden sm:block">
                A Journey of Progress
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Firebase Cloud Sync Indicator Badge */}
            {syncStatus === 'synced' && (
              <button
                onClick={onShowFirebaseInfo}
                title="Firebase Cloud Synced - Click for status details"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
              >
                <Cloud size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">Synced</span>
              </button>
            )}
            {syncStatus === 'syncing' && (
              <button
                onClick={onShowFirebaseInfo}
                title="Syncing with Firebase Cloud..."
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all"
              >
                <RefreshCw size={14} className="animate-spin text-amber-400" />
                <span className="hidden sm:inline">Syncing</span>
              </button>
            )}
            {syncStatus === 'error' && (
              <button
                onClick={onShowFirebaseInfo}
                title="Firebase Sync Error! Click for setup instructions"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/20 transition-all animate-pulse"
              >
                <AlertTriangle size={14} className="text-red-400" />
                <span className="hidden sm:inline">Sync Error</span>
              </button>
            )}
            {syncStatus === 'disabled' && (
              <button
                onClick={onShowFirebaseInfo}
                title="Firebase Disconnected"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-500/10 text-slate-400 border border-slate-500/30 text-xs font-semibold hover:bg-slate-500/20 transition-all"
              >
                <CloudOff size={14} className="text-slate-400" />
                <span className="hidden sm:inline">Offline</span>
              </button>
            )}

            <button
              onClick={onOpenTaskModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>

            {/* Backup & Restore Action Buttons */}
            {onExportData && (
              <button
                onClick={onExportData}
                title="Backup Notebook JSON"
                className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all"
              >
                <Download size={16} />
              </button>
            )}

            {onImportData && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Restore Notebook JSON"
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
                >
                  <Upload size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </>
            )}

            {onLockApp && (
              <button
                onClick={onLockApp}
                title="Lock Notebook"
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all"
              >
                <Lock size={16} />
              </button>
            )}

            <button
              onClick={() => setIsDark(!isDark)}
              title="Toggle Theme"
              className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] transition-all"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
            </button>
          </div>

        </div>

        {/* Mobile / Medium Screen Navigation Links */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-[var(--border-color)] overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center space-y-0.5 shrink-0 ${
                  isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-[var(--text-muted)]'
                }`}
              >
                {item.icon}
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
