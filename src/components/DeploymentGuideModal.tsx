import React from 'react';
import { X, Rocket, ShieldCheck, HardDriveDownload, ExternalLink, Terminal } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-violet-500/30 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">
                Deployment & Hosting Guide (Vercel / GitHub)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                How to deploy this app live for free & manage your personal data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
          
          {/* Section 1: Data Privacy & Storage */}
          <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
            <h4 className="font-bold text-indigo-300 flex items-center space-x-2 mb-2">
              <ShieldCheck size={18} />
              <span>🔒 How your Data Privacy & Storage Works</span>
            </h4>
            <ul className="text-xs space-y-1.5 text-[var(--text-muted)] list-disc pl-5">
              <li>
                App-er shob data (tasks, exam dates, skill progress, notes) apnar nijer browser-er <strong>LocalStorage</strong>-e 100% private ebong encrypted thake.
              </li>
              <li>
                Apni Vercel ba GitHub Pages jekhanei deploy korn na keno, data purapuri apnar device-ei thakbe.
              </li>
              <li>
                <strong>Backup & Restore:</strong> Top bar-er <HardDriveDownload size={14} className="inline text-indigo-400" /> Export JSON button e click korle 1-sec-e puraa database backup download hoye jabe!
              </li>
            </ul>
          </div>

          {/* Section 2: Vercel Deployment */}
          <div className="space-y-2">
            <h4 className="font-bold text-base text-violet-400 flex items-center space-x-2">
              <span>🚀 Option 1: Deploy on Vercel (Recommended - 2 Minutes)</span>
            </h4>
            <ol className="text-xs space-y-2 text-[var(--text-muted)] list-decimal pl-5 bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-color)]">
              <li>
                Ei project folder-ti apnar <strong>GitHub</strong> account-e akta Private repository te Push/Upload korun.
              </li>
              <li>
                <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline inline-flex items-center space-x-1">
                  <span>Vercel.com</span>
                  <ExternalLink size={12} />
                </a> e giye GitHub account diye Login korun.
              </li>
              <li>
                <strong>"Add New Project"</strong> click kore apnar <code>DailyWork</code> repo-ti Select korun.
              </li>
              <li>
                Framework Preset auto-detect hobe <code>Vite</code>. Right bottom-e <strong>"Deploy"</strong> button-e click korun!
              </li>
              <li>
                30 seconds er moddhe apnar nijer Personal Live Link toiri hoye jabe! 🎉
              </li>
            </ol>
          </div>

          {/* Section 3: GitHub Pages Deployment */}
          <div className="space-y-2">
            <h4 className="font-bold text-base text-emerald-400 flex items-center space-x-2">
              <span>🌐 Option 2: Deploy on GitHub Pages</span>
            </h4>
            <div className="text-xs space-y-2 text-[var(--text-muted)] bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-color)]">
              <p>Terminal-e nicher command ti run kore production build toiri kora jay:</p>
              <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-xl font-mono text-emerald-400">
                <span>npm run build</span>
                <Terminal size={14} />
              </div>
              <p>Build toiri hone <code>dist</code> folder-er contents GitHub Pages e upload/publish korle instant live hoye jabe.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
