import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

// SHA-256 Hash constant for user's passcode (6996)
// Computed via Web Crypto API: crypto.subtle.digest('SHA-256', TextEncoder.encode('6996'))
const TARGET_PASSCODE_HASH = '9b7db63b1e95c2891660533fdcc7e5300af42e36966247b4928db477cd5a0f77';

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Helper function to hash input PIN using browser Web Crypto API SHA-256
  const computeSha256 = async (inputStr: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(inputStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const hashedInput = await computeSha256(pinInput.trim());

      if (hashedInput === TARGET_PASSCODE_HASH) {
        // Success! Save session state & trigger unlock callback
        sessionStorage.setItem('DAILYWORK_SESSION_AUTH', 'true');
        onUnlock();
      } else {
        // Incorrect PIN
        setErrorMsg('Access Denied: Incorrect Security PIN');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
        setPinInput('');
      }
    } catch (err) {
      console.error('Crypto Verification Error:', err);
      setErrorMsg('Verification system error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
      <div
        className={`glass-card max-w-md w-full p-7 sm:p-8 rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-950 shadow-2xl relative transition-transform ${
          isShaking ? 'animate-bounce border-red-500/80 shadow-red-500/30' : ''
        }`}
      >
        {/* Lock Icon & Branding */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 border border-indigo-500/40 text-indigo-300 shadow-xl shadow-indigo-500/20 animate-pulse">
            <Lock size={38} />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text-main)]">
              Daily Reflections
            </h2>
            <p className="text-xs font-semibold text-indigo-300/80 mt-0.5">
              Personal Notebook • Password Protected
            </p>
          </div>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-[var(--text-muted)] tracking-wider mb-2 text-center">
              Enter Passcode
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full pl-10 pr-12 py-3 rounded-2xl bg-black/60 border border-indigo-500/40 text-[var(--text-main)] placeholder-gray-500 text-center font-mono text-lg tracking-[0.4em] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={isVerifying || !pinInput.trim()}
                className="absolute inset-y-1.5 right-1.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-md"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold text-center animate-pulse">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Security Note */}
          <div className="pt-3 border-t border-[var(--border-color)] text-center">
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold text-indigo-300/70">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Encrypted with SHA-256 Web Crypto Security</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
