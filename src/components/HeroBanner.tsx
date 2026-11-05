import React from 'react';
import { Search, X, RotateCcw, Pin, Layers } from 'lucide-react';
import { Department } from '../types/notice';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: Department;
  totalNotices: number;
  pinnedCount: number;
  filteredCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  totalNotices,
  pinnedCount,
  filteredCount,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-6 transition-colors">
      
      {/* Background Graphic & Accent */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/campus_hero_banner_1793904744860.jpg"
          alt="University Campus Quad"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-700 hover:scale-100"
          onError={(e) => {
            // Elegant gradient fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-blue-950/40" />

        {/* Content Inside Hero Header */}
        <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end text-white">
          <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200 mb-2">
            <span>Academic Year 2026–2027</span>
            <span aria-hidden="true">·</span>
            <span>Accredited A++ Campus</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Notice System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-2xl text-balance">
            College Notice Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl line-clamp-2">
            Stay informed with verified academic notices, examination circulars, department seminars, and campus events.
          </p>
        </div>
      </div>

      {/* Control Strip & Live Search Bar */}
      <div className="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notices by title, keywords, or department faculty..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Metrics & Refresh Button */}
          <div className="flex items-center gap-3 justify-between md:justify-end text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Total: <strong className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{totalNotices}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <span>Pinned: <strong className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{pinnedCount}</strong></span>
              </div>
              {selectedDepartment !== 'All' && (
                <div className="hidden sm:inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                  <span>Filtered: {filteredCount}</span>
                </div>
              )}
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors disabled:opacity-60"
              title="Refresh notices list"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
