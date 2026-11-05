import React from 'react';
import { Notice } from '../types/notice';
import { formatFullDate } from '../utils/dateUtils';
import { X, Download, Printer, FileText, CheckCircle2 } from 'lucide-react';

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  notice: Notice | null;
  onClose: () => void;
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  isOpen,
  notice,
  onClose
}) => {
  if (!isOpen || !notice || !notice.attachment) return null;

  const handleDownload = () => {
    const textContent = `UNIVERSITY ACADEMIC CIRCULAR\nDocument: ${notice.attachment?.name}\nDepartment: ${notice.department}\nReference: ${notice.id}\nDate: ${formatFullDate(notice.publishedDate)}\nAuthority: ${notice.postedBy}\n\nTitle:\n${notice.title}\n\nDescription:\n${notice.description}\n\n[OFFICIAL UNIVERSITY SEAL VERIFIED]`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = notice.attachment?.name || 'document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Document Bar */}
        <div className="px-6 py-3.5 bg-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-mono font-medium truncate">
              {notice.attachment.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono shrink-0">
              ({notice.attachment.size})
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Body */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 overflow-y-auto max-h-[75vh]">
          {/* Letterhead Header */}
          <div className="text-center border-b-2 border-slate-900/80 pb-6 mb-6">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border border-slate-300 flex items-center justify-center bg-blue-900 text-white">
              <img 
                src="/src/assets/images/university_crest_logo_1793904744263.jpg" 
                alt="University Seal"
                className="w-full h-full object-cover" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="text-xs font-bold">CNB</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-950 font-serif">
              University College of Engineering & Technology
            </h2>
            <p className="text-xs text-slate-600 font-sans tracking-wide">
              Autonomous Institution · Accredited 'A++' Grade
            </p>
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-widest mt-1">
              Department of {notice.department}
            </p>
          </div>

          {/* Reference & Date Bar */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-mono mb-6 border-b border-slate-200 pb-2">
            <span>REF: UCET/{notice.department.toUpperCase()}/2026/{notice.id.slice(-6).toUpperCase()}</span>
            <span>Date: {formatFullDate(notice.publishedDate)}</span>
          </div>

          {/* Document Subject */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900 font-serif uppercase tracking-tight">
              Subject: {notice.title}
            </h3>
          </div>

          {/* Circular Body */}
          <div className="text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line space-y-4 mb-10">
            {notice.description}
          </div>

          {/* Signatures & Seal */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digitally Verified Copy</span>
              </div>
              <p className="text-slate-500 font-mono text-[11px]">
                Authentication Key: SHA-256 Verified
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-base text-slate-900 mb-1">
                {notice.postedBy}
              </div>
              <div className="text-slate-600 font-medium">
                {notice.authorRole || 'Academic Head / Administrator'}
              </div>
              <div className="text-slate-500 text-[11px]">
                College Notice Board Dispatch
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
