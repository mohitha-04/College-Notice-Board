import React from 'react';
import { Notice } from '../types/notice';
import { formatRelativeDate } from '../utils/dateUtils';
import { 
  Pin, 
  Paperclip, 
  Calendar, 
  Building2, 
  Eye, 
  Bookmark, 
  Trash2, 
  Edit3, 
  ArrowRight,
  Laptop,
  Cpu,
  Radio,
  Zap,
  Cog,
  GraduationCap
} from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  onSelect: (notice: Notice) => void;
  isAdmin: boolean;
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
  onTogglePin?: (notice: Notice) => void;
  isBookmarked: boolean;
  onToggleBookmark: (noticeId: string) => void;
}

const DEPARTMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CSE: Laptop,
  AIML: Cpu,
  ECE: Radio,
  EEE: Zap,
  Mechanical: Cog,
  Civil: Building2,
  General: GraduationCap
};

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  onSelect,
  isAdmin,
  onEdit,
  onDelete,
  onTogglePin,
  isBookmarked,
  onToggleBookmark
}) => {
  const DeptIcon = DEPARTMENT_ICONS[notice.department] || Building2;
  const relativeDate = formatRelativeDate(notice.publishedDate);

  return (
    <article
      onClick={() => onSelect(notice)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        notice.isPinned
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-xs hover:border-amber-400 dark:hover:border-amber-700'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Top Metadata Row: Pinned Tag, Department, Date */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs">
            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/40 px-2 py-0.5 rounded-md text-[11px]">
                <Pin className="w-3 h-3 fill-amber-700 dark:fill-amber-400" />
                <span>IMPORTANT</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400">
              <DeptIcon className="w-3.5 h-3.5" />
              <span>{notice.department}</span>
            </span>

            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>

            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{relativeDate}</span>
            </span>
          </div>

          {/* Quick Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(notice.id);
            }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked
                  ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400'
                  : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Notice Title */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {notice.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          {notice.description}
        </p>
      </div>

      {/* Card Footer: Posted By, Attachment Badge, and Read Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        
        {/* Author / Posted By & Attachment */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-slate-500 dark:text-slate-400 truncate">
          <span className="truncate font-medium text-slate-700 dark:text-slate-300">
            {notice.postedBy}
          </span>

          {notice.attachment && (
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 truncate font-mono">
              <Paperclip className="w-3 h-3 shrink-0" />
              <span className="truncate">{notice.attachment.name}</span>
            </span>
          )}
        </div>

        {/* Admin Controls or View Details Affordance */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {isAdmin ? (
            <div className="flex items-center gap-1">
              {onTogglePin && (
                <button
                  type="button"
                  onClick={() => onTogglePin(notice)}
                  title={notice.isPinned ? 'Unpin notice' : 'Pin to top'}
                  className="p-1.5 text-slate-500 hover:text-amber-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Pin className={`w-3.5 h-3.5 ${notice.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(notice)}
                  title="Edit notice"
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(notice)}
                  title="Delete notice"
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
              <span>Read</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

      </div>
    </article>
  );
};
