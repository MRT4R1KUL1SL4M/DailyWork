import React from 'react';
import { Cloud, AlertTriangle, CheckCircle2, X, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import { SyncStatusType } from './Navbar';

interface FirebaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: SyncStatusType;
  errorMessage?: string;
}

export const FirebaseInfoModal: React.FC<FirebaseInfoModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  errorMessage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cloud size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Firebase Cloud Sync Status</h3>
              <p className="text-xs text-[var(--text-muted)]">Real-time data backup and sync status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Status Box */}
        <div className="mt-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex items-center space-x-3">
            {syncStatus === 'synced' && (
              <>
                <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">Firebase Connected & Synced</h4>
                  <p className="text-xs text-[var(--text-muted)]">Your notebook data is backed up to Firestore Cloud in real-time.</p>
                </div>
              </>
            )}
            {syncStatus === 'syncing' && (
              <>
                <Cloud size={24} className="text-amber-400 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400">Syncing with Firestore...</h4>
                  <p className="text-xs text-[var(--text-muted)]">Uploading latest changes to your Firebase Cloud database.</p>
                </div>
              </>
            )}
            {syncStatus === 'error' && (
              <>
                <AlertTriangle size={24} className="text-red-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-400">Firebase Sync Error</h4>
                  <p className="text-xs text-red-300/90 font-mono mt-0.5">{errorMessage || 'Firestore permission or network error.'}</p>
                </div>
              </>
            )}
            {syncStatus === 'disabled' && (
              <>
                <Cloud size={24} className="text-slate-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-400">Firebase Not Configured</h4>
                  <p className="text-xs text-[var(--text-muted)]">Firebase environment variables are missing.</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Firebase Setup & Fix Instructions */}
        <div className="mt-5 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-indigo-400" />
            Firestore Rules & Troubleshooting
          </h4>

          <div className="space-y-3 text-xs text-[var(--text-main)]">
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
              <p className="font-semibold text-indigo-300 flex items-center justify-between">
                <span>1. Firebase Firestore Security Rules</span>
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-normal underline"
                >
                  Firebase Console <ExternalLink size={12} />
                </a>
              </p>
              <p className="text-[var(--text-muted)]">
                If reads/writes fail with permission errors, make sure Security Rules allow read/write in Firebase Console:
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-[var(--border-color)] space-y-1.5">
              <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Database size={14} />
                2. Firestore Database Initialization
              </p>
              <p className="text-[var(--text-muted)]">
                Ensure project <code className="text-amber-300 font-mono bg-slate-800 px-1 py-0.5 rounded">dailywork-93ea5</code> has a Firestore Database created in Production or Test mode.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
