import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, KeyRound, AlertCircle, X, Check } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAsAdmin, switchRole, role } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If passcode is blank or matches admin/college2026, allow login
    const success = loginAsAdmin(passcode || 'admin');
    if (success) {
      setPasscode('');
      closeLoginModal();
    } else {
      setError('Invalid administrator passcode. Use "admin" or click Instant Demo Access below.');
    }
  };

  const handleInstantAdmin = () => {
    loginAsAdmin('admin');
  };

  const handleSwitchToStudent = () => {
    switchRole('student');
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Campus Portal Role Access
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between Student and Administrator
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 mb-5 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Active Mode:
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            role === 'admin' 
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' 
              : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
          }`}>
            {role === 'admin' ? 'Administrator (Full Access)' : 'Student (Read-Only)'}
          </span>
        </div>

        {/* Admin Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Administrator Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter passcode (default: admin)"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Authenticate as Administrator
            </button>

            <button
              type="button"
              onClick={handleInstantAdmin}
              className="w-full py-2 px-4 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Instant 1-Click Admin Access</span>
            </button>
          </div>
        </form>

        {/* Switch back to Student */}
        {role === 'admin' && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSwitchToStudent}
              className="w-full py-2 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to Student Mode</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
