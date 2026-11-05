import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  ShieldCheck, 
  UserCheck, 
  PlusCircle, 
  Database,
  Bookmark,
  Bell
} from 'lucide-react';

interface HeaderProps {
  onOpenPostNotice: () => void;
  onOpenFirebaseInfo: () => void;
  showBookmarksOnly: boolean;
  onToggleBookmarks: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPostNotice,
  onOpenFirebaseInfo,
  showBookmarksOnly,
  onToggleBookmarks,
  bookmarkCount
}) => {
  const { user, isAdmin, openLoginModal, logoutToStudent } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark & Seal */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-900 flex items-center justify-center shadow-sm border border-blue-800/40">
            <img 
              src="/src/assets/images/university_crest_logo_1793904744263.jpg" 
              alt="College Crest" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to stylized SVG icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-white font-bold text-xs tracking-wider" aria-hidden="true">
              CNB
            </span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
              College Notice Board
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-200 block">
              Official Campus Communication Portal
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              if (showBookmarksOnly) onToggleBookmarks();
            }}
            className={`transition-colors whitespace-nowrap ${
              !showBookmarksOnly 
                ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Notices
          </button>
          
          <button
            onClick={onToggleBookmarks}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              showBookmarksOnly 
                ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Notices</span>
            {bookmarkCount > 0 && (
              <span className="text-[11px] font-mono tabular-nums bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded font-semibold">
                {bookmarkCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenFirebaseInfo}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
            title="View Firebase Firestore & Storage configuration"
          >
            <Database className="w-4 h-4 text-amber-500" />
            <span>Firebase Config</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Role Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Post Notice CTA */}
          {isAdmin ? (
            <button
              onClick={onOpenPostNotice}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin Access</span>
            </button>
          )}

          {/* User Role Badge / Switch */}
          <div className="flex items-center pl-1 border-l border-slate-200 dark:border-slate-800">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden xl:inline text-xs font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  Admin: {user.name.split(' ')[1] || user.name}
                </span>
                <button
                  onClick={logoutToStudent}
                  className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors whitespace-nowrap"
                  title="Switch to Student view"
                >
                  Exit Admin
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors whitespace-nowrap"
                title="Click to authenticate as College Admin"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Student</span>
              </button>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
