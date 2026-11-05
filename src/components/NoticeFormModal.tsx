import React, { useState, useEffect } from 'react';
import { Department, Notice, NoticeCategory, NoticeAttachment } from '../types/notice';
import { NoticeService } from '../services/noticeService';
import { toInputDateFormat } from '../utils/dateUtils';
import { 
  X, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Pin, 
  Calendar, 
  Building2, 
  FileText, 
  Paperclip,
  Trash2
} from 'lucide-react';

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notice: Notice) => void;
  editingNotice?: Notice | null;
  defaultDepartment?: Department;
}

const DEPARTMENTS: Exclude<Department, 'All'>[] = [
  'CSE',
  'AIML',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'General'
];

const CATEGORIES: NoticeCategory[] = [
  'Academic',
  'Examination',
  'Placement',
  'Events',
  'Urgent',
  'General'
];

export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingNotice,
  defaultDepartment
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Exclude<Department, 'All'>>('CSE');
  const [category, setCategory] = useState<NoticeCategory>('Academic');
  const [publishedDate, setPublishedDate] = useState(toInputDateFormat(new Date()));
  const [postedBy, setPostedBy] = useState('Office of the Dean & Academic Registrar');
  const [authorRole, setAuthorRole] = useState('Academic Administrator');
  const [isPinned, setIsPinned] = useState(false);
  const [attachment, setAttachment] = useState<NoticeAttachment | null>(null);

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (editingNotice) {
      setTitle(editingNotice.title);
      setDescription(editingNotice.description);
      setDepartment(editingNotice.department);
      setCategory(editingNotice.category || 'Academic');
      setPublishedDate(toInputDateFormat(editingNotice.publishedDate));
      setPostedBy(editingNotice.postedBy);
      setAuthorRole(editingNotice.authorRole || 'Faculty Coordinator');
      setIsPinned(editingNotice.isPinned);
      setAttachment(editingNotice.attachment || null);
    } else {
      // New form defaults
      setTitle('');
      setDescription('');
      setDepartment(defaultDepartment && defaultDepartment !== 'All' ? defaultDepartment : 'CSE');
      setCategory('Academic');
      setPublishedDate(toInputDateFormat(new Date()));
      setPostedBy('Office of the Dean & Academic Registrar');
      setAuthorRole('Academic Administrator');
      setIsPinned(false);
      setAttachment(null);
    }
    setErrors({});
    setIsDuplicate(false);
    setSuccessMsg('');
  }, [editingNotice, defaultDepartment, isOpen]);

  // Live duplicate checking on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
    if (val.trim().length >= 5) {
      const isDup = NoticeService.checkDuplicateTitle(val, editingNotice?.id);
      setIsDuplicate(isDup);
    } else {
      setIsDuplicate(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read attachment metadata
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;
    
    let type: NoticeAttachment['type'] = 'pdf';
    if (file.type.includes('image')) type = 'image';
    else if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) type = 'sheet';
    else if (file.type.includes('word') || file.name.endsWith('.docx')) type = 'doc';

    setAttachment({
      id: `att-${Date.now()}`,
      name: file.name,
      size: sizeStr,
      type,
      url: '#'
    });
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleAttachSampleDocument = () => {
    setAttachment({
      id: `att-${Date.now()}`,
      name: `${department}_Official_Circular_${Date.now().toString().slice(-4)}.pdf`,
      size: '1.2 MB',
      type: 'pdf',
      url: '#'
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Notice Title is required and cannot be empty.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must contain at least 5 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Notice Description is required and cannot be empty.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please provide a more descriptive notice (minimum 15 characters).';
    }

    if (!department) {
      newErrors.department = 'A valid Department must be selected.';
    }

    if (!publishedDate) {
      newErrors.publishedDate = 'Published date must be valid.';
    } else {
      const d = new Date(publishedDate);
      if (isNaN(d.getTime())) {
        newErrors.publishedDate = 'Please select a valid calendar date.';
      }
    }

    if (!postedBy.trim()) {
      newErrors.postedBy = 'Author / Authority name is required.';
    }

    // Check duplicate
    if (NoticeService.checkDuplicateTitle(title, editingNotice?.id)) {
      newErrors.title = 'A notice with this exact title already exists. Please revise to prevent accidental duplicates.';
      setIsDuplicate(true);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const dateIso = new Date(publishedDate).toISOString();

      if (editingNotice) {
        const updated = NoticeService.updateNotice(editingNotice.id, {
          title: title.trim(),
          description: description.trim(),
          department,
          category,
          publishedDate: dateIso,
          postedBy: postedBy.trim(),
          authorRole: authorRole.trim(),
          isPinned,
          attachment
        });
        if (updated) {
          setSuccessMsg('Notice updated successfully!');
          setTimeout(() => {
            onSave(updated);
            onClose();
          }, 600);
        }
      } else {
        const created = NoticeService.createNotice({
          title: title.trim(),
          description: description.trim(),
          department,
          category,
          publishedDate: dateIso,
          postedBy: postedBy.trim(),
          authorRole: authorRole.trim(),
          isPinned,
          attachment
        });
        setSuccessMsg('Notice published successfully to the college board!');
        setTimeout(() => {
          onSave(created);
          onClose();
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An unexpected error occurred while saving the notice.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {editingNotice ? 'Edit College Notice' : 'Publish New Notice'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Campus Notification & Circular Dispatch Form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Duplicate Warning Banner */}
        {isDuplicate && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>A notice with this title already exists. Please review to avoid duplicate submissions.</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notice Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Schedule for Mid-Term Examination - Fall 2026"
              className={`w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border rounded-xl shadow-2xs focus:outline-none focus:ring-2 transition-all ${
                errors.title 
                  ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-400' 
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Department & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value as Exclude<Department, 'All'>);
                    if (errors.department) setErrors(prev => ({ ...prev, department: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>
                      {dept} Department
                    </option>
                  ))}
                </select>
                <Building2 className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.department && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Notice Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Published Date & Authority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Published Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => {
                    setPublishedDate(e.target.value);
                    if (errors.publishedDate) setErrors(prev => ({ ...prev, publishedDate: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              {errors.publishedDate && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.publishedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Posted By (Authority) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={postedBy}
                onChange={(e) => {
                  setPostedBy(e.target.value);
                  if (errors.postedBy) setErrors(prev => ({ ...prev, postedBy: '' }));
                }}
                placeholder="e.g. Dr. Rajesh Sharma, HOD CSE"
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {errors.postedBy && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.postedBy}</p>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Notice Full Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {description.length} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="Provide complete notice details, dates, eligibility criteria, venue, instructions for students, and contact details..."
              className={`w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border rounded-xl shadow-2xs focus:outline-none focus:ring-2 transition-all leading-relaxed ${
                errors.description 
                  ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-400' 
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Optional Attachment Section */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>Document Attachment (Optional)</span>
              </span>
              {!attachment && (
                <button
                  type="button"
                  onClick={handleAttachSampleDocument}
                  className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Add Sample PDF
                </button>
              )}
            </div>

            {attachment ? (
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Paperclip className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {attachment.size}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg transition-colors">
                  <UploadCloud className="w-4 h-4 text-slate-400" />
                  <span>Choose file to upload (PDF, DOC, Images)</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Pinned / Important Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Pin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Highlight as Important / Pinned Notice
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Pinned notices stay prioritized at the top of the college board
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{editingNotice ? 'Save Changes' : 'Publish Notice to Board'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
