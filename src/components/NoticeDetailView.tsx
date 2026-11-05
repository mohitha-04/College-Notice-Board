import React, { useState } from 'react';
import { Notice } from '../types/notice';
import { formatFullDate, formatRelativeDate } from '../utils/dateUtils';
import { 
  ArrowLeft, 
  Pin, 
  Calendar, 
  Building2, 
  UserCheck, 
  Paperclip, 
  Download, 
  Eye, 
  Share2, 
  Printer, 
  Bookmark, 
  Edit3, 
  Trash2,
  Check,
  Laptop,
  Cpu,
  Radio,
  Zap,
  Cog,
  GraduationCap
} from 'lucide-react';

interface NoticeDetailViewProps {
  notice: Notice;
  onBack: () => void;
  isAdmin: boolean;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onTogglePin: (notice: Notice) => void;
  isBookmarked: boolean;
  onToggleBookmark: (noticeId: string) => void;
  onPreviewAttachment: (notice: Notice) => void;
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

export const NoticeDetailView: React.FC<NoticeDetailViewProps> = ({
  notice,
  onBack,
  isAdmin,
  onEdit,
  onDelete,
  onTogglePin,
  isBookmarked,
  onToggleBookmark,
  onPreviewAttachment
}) => {
  const [copied, setCopied] = useState(false);
  const DeptIcon = DEPARTMENT_ICONS[notice.department] || Building2;

  const handleShare = () => {
    const text = `${notice.title} - ${notice.department} Department Notice (Published: ${formatRelativeDate(notice.publishedDate)})\n\n${notice.description.slice(0, 160)}...`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAttachment = () => {
    if (!notice.attachment) return;
    // Create simulated file download
    const content = `CAMPUS OFFICIAL NOTICE\nDepartment: ${notice.department}\nTitle: ${notice.title}\nDate: ${formatFullDate(notice.publishedDate)}\nPosted By: ${notice.postedBy}\n\n${notice.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = notice.attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-0">
      
      {/* Top Action Bar / Back Navigation */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notice Board</span>
        </button>

        {/* Action Buttons: Bookmark, Share, Print, Admin */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(notice.id)}
            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors ${
              isBookmarked 
                ? 'text-blue-600 dark:text-blue-400 fill-blue-600' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title="Copy notice summary"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title="Print notice"
          >
            <Printer className="w-4 h-4" />
          </button>

          {isAdmin && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onTogglePin(notice)}
                className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors ${
                  notice.isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 hover:text-amber-500'
                }`}
                title={notice.isPinned ? 'Unpin notice' : 'Pin notice'}
              >
                <Pin className={`w-4 h-4 ${notice.isPinned ? 'fill-amber-500' : ''}`} />
              </button>
              <button
                onClick={() => onEdit(notice)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                title="Edit notice"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(notice)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                title="Delete notice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Notice Document Container */}
      <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-10 transition-colors">
        
        {/* Header Kicker: Department & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <DeptIcon className="w-3.5 h-3.5" />
              <span>Department of {notice.department}</span>
            </span>

            {notice.category && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {notice.category} Circular
              </span>
            )}
          </div>

          {notice.isPinned && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-1 rounded-md">
              <Pin className="w-3.5 h-3.5 fill-amber-700 dark:fill-amber-400" />
              <span>PINNED / IMPORTANT</span>
            </span>
          )}
        </div>

        {/* Complete Notice Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white my-6 leading-tight">
          {notice.title}
        </h1>

        {/* Metadata Strip: Author, Date, Time */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {notice.postedBy.charAt(0)}
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                {notice.postedBy}
              </span>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                {notice.authorRole || 'Campus Administrative Authority'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-slate-500 dark:text-slate-400 gap-0.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatFullDate(notice.publishedDate)}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ({formatRelativeDate(notice.publishedDate)})
            </span>
          </div>
        </div>

        {/* Full Notice Description */}
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line mb-8">
          {notice.description}
        </div>

        {/* Optional Attachment Card */}
        {notice.attachment && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Official Document Attachment
            </h4>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {notice.attachment.name}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {notice.attachment.size} · PDF Document
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPreviewAttachment(notice)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handleDownloadAttachment}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Institutional Verification Stamp / Footer */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
          <span>Official University Electronic Communication · Reference ID: {notice.id}</span>
          <span>Verified by Academic Administration</span>
        </div>

      </article>

    </div>
  );
};
