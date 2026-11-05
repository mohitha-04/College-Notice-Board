import React, { useState } from 'react';
import { NoticeService } from '../services/noticeService';
import { Notice } from '../types/notice';
import { 
  Database, 
  X, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  HardDrive,
  FileCode,
  CheckCircle2
} from 'lucide-react';

interface FirebaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetNotices: () => void;
  notices: Notice[];
}

export const FirebaseInfoModal: React.FC<FirebaseInfoModalProps> = ({
  isOpen,
  onClose,
  onResetNotices,
  notices
}) => {
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'rules' | 'export'>('architecture');

  if (!isOpen) return null;

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Notices Collection
    match /notices/{noticeId} {
      // Anyone (students, faculty) can read verified notices
      allow read: if true;
      
      // Only authenticated users with admin role can create, update, or delete
      allow create, update, delete: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.admin == true);
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /attachments/{noticeId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}`;

  const schemaExample = `{
  "id": "notice-2026-001",
  "title": "End-Semester Examinations Schedule - Fall 2026",
  "description": "Theory examinations commence from Nov 20, 2026...",
  "department": "CSE | AIML | ECE | EEE | Mechanical | Civil | General",
  "category": "Academic | Examination | Placement | Events | Urgent | General",
  "publishedDate": "2026-11-05T09:00:00.000Z",
  "postedBy": "Office of the Controller of Examinations",
  "authorRole": "Examination Authority",
  "isPinned": true,
  "viewsCount": 342,
  "attachment": {
    "id": "att-1",
    "name": "End_Sem_Timetable_2026.pdf",
    "size": "1.4 MB",
    "type": "pdf",
    "url": "gs://college-notices.appspot.com/attachments/..."
  },
  "createdAt": "2026-11-05T09:00:00.000Z"
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaExample);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `college_notices_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Data Management & Firebase Integration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Firestore cloud persistence, storage attachments & local fallback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="p-4 mx-6 mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Local-Storage Cache Active ({notices.length} notices synced)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Data persists across page refreshes and browser sessions automatically
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
            PERSISTENT
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 mt-4 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Firestore Schema
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'rules'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Security Rules
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Data Tools
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 text-xs text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  1. Dual-Mode Architecture (Cloud + Local Fallback)
                </h4>
                <p className="leading-relaxed">
                  Per Project Objective #5: The application uses a robust layered architecture. When Firebase is not provisioned or offline, it falls back seamlessly to HTML5 LocalStorage, preserving all notices, pinned orders, bookmarks, and attachments without breaking.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  2. Connecting to Firebase Firestore
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                  <li>In your Firebase Console, create a new Web project: <strong>College Notice Board</strong>.</li>
                  <li>Enable <strong>Cloud Firestore</strong> in production mode.</li>
                  <li>Enable <strong>Firebase Storage</strong> for PDF/document attachments.</li>
                  <li>Enable <strong>Firebase Authentication</strong> (Email/Password or Google Sign-In) to issue admin custom claims (<code>role: 'admin'</code>).</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  3. User Role Enforcement
                </h4>
                <p className="leading-relaxed">
                  Students have read-only privileges to browse, search, and download circulars. Only verified administrator accounts can write to the Firestore <code>/notices</code> collection or upload documents to Firebase Storage.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Collection: <code className="text-blue-600 dark:text-blue-400">/notices/{'{noticeId}'}</code>
                </span>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-[11px] overflow-x-auto text-slate-800 dark:text-slate-200">
                {schemaExample}
              </pre>
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  firestore.rules & storage.rules
                </span>
                <button
                  onClick={handleCopyRules}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedRules ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRules ? 'Copied' : 'Copy Rules'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-[11px] overflow-x-auto text-slate-800 dark:text-slate-200">
                {firestoreRules}
              </pre>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Export Notice Dataset
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Download all active notice records formatted as JSON for bulk import into Firestore.
                </p>
                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download notices.json</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Reset Demo Notices
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Restore original verified sample notices across all 7 departments (CSE, AIML, ECE, EEE, Mechanical, Civil, General).
                </p>
                <button
                  onClick={() => {
                    onResetNotices();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Demo Dataset</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
