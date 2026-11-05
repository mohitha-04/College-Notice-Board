import React, { useState, useEffect, useMemo } from 'react';
import { Department, Notice } from './types/notice';
import { NoticeService } from './services/noticeService';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DepartmentFilter } from './components/DepartmentFilter';
import { NoticeCard } from './components/NoticeCard';
import { NoticeDetailView } from './components/NoticeDetailView';
import { NoticeFormModal } from './components/NoticeFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { LoginModal } from './components/LoginModal';
import { FirebaseInfoModal } from './components/FirebaseInfoModal';
import { AttachmentPreviewModal } from './components/AttachmentPreviewModal';
import { 
  Inbox, 
  Search, 
  RotateCcw, 
  PlusCircle, 
  Bookmark, 
  CheckCircle2,
  FileText
} from 'lucide-react';

function CollegeNoticeBoardContent() {
  const { isAdmin, openLoginModal } = useAuth();

  // Notices state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Navigation State: null means Home Screen; a Notice object means Detail Screen
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);

  // Load notices and bookmarks on mount
  useEffect(() => {
    loadNotices();
    setBookmarkedIds(NoticeService.getBookmarks());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const loadNotices = () => {
    setIsLoading(true);
    try {
      const data = NoticeService.getNotices();
      setNotices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadNotices();
      setIsRefreshing(false);
      showToast('Notice board synchronized successfully');
    }, 450);
  };

  // Department counts calculated from all notices
  const departmentCounts = useMemo(() => {
    return NoticeService.getDepartmentCounts(notices);
  }, [notices]);

  // Filtered and sorted notices
  const displayedNotices = useMemo(() => {
    let result = [...notices];

    // Filter by bookmarks if enabled
    if (showBookmarksOnly) {
      result = result.filter(n => bookmarkedIds.includes(n.id));
    }

    // Filter by Department
    if (selectedDepartment !== 'All') {
      result = result.filter(n => n.department === selectedDepartment);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.postedBy.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        (n.category && n.category.toLowerCase().includes(q))
      );
    }

    // Sort: Pinned first, then latest publishedDate first
    return NoticeService.sortNotices(result);
  }, [notices, selectedDepartment, searchQuery, showBookmarksOnly, bookmarkedIds]);

  // Pinned count
  const pinnedCount = useMemo(() => {
    return notices.filter(n => n.isPinned).length;
  }, [notices]);

  // Notice selection / View Details
  const handleSelectNotice = (notice: Notice) => {
    NoticeService.incrementView(notice.id);
    setSelectedNotice(notice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Home
  const handleBackToHome = () => {
    setSelectedNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookmark toggle
  const handleToggleBookmark = (id: string) => {
    const updated = NoticeService.toggleBookmark(id);
    setBookmarkedIds(updated);
  };

  // Admin Actions
  const handleOpenPostNotice = () => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setEditingNotice(null);
    setIsFormModalOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setEditingNotice(notice);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (notice: Notice) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    setNoticeToDelete(notice);
  };

  const handleConfirmDelete = () => {
    if (!noticeToDelete) return;
    const success = NoticeService.deleteNotice(noticeToDelete.id);
    if (success) {
      setNotices(prev => prev.filter(n => n.id !== noticeToDelete.id));
      if (selectedNotice?.id === noticeToDelete.id) {
        setSelectedNotice(null);
      }
      showToast('Notice deleted successfully.');
    }
    setNoticeToDelete(null);
  };

  const handleTogglePin = (notice: Notice) => {
    if (!isAdmin) {
      openLoginModal();
      return;
    }
    const updated = NoticeService.togglePin(notice.id);
    if (updated) {
      setNotices(prev => prev.map(n => n.id === updated.id ? updated : n));
      if (selectedNotice?.id === updated.id) {
        setSelectedNotice(updated);
      }
      showToast(updated.isPinned ? 'Notice pinned to top.' : 'Notice unpinned.');
    }
  };

  const handleSaveNotice = (saved: Notice) => {
    setNotices(prev => {
      const idx = prev.findIndex(n => n.id === saved.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    if (selectedNotice?.id === saved.id) {
      setSelectedNotice(saved);
    }

    showToast(editingNotice ? 'Notice updated successfully.' : 'New notice published.');
  };

  const handleResetNotices = () => {
    const fresh = NoticeService.resetToInitial();
    setNotices(fresh);
    setSelectedNotice(null);
    setSelectedDepartment('All');
    setSearchQuery('');
    setShowBookmarksOnly(false);
    showToast('Reset to original sample notices.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-lg border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Bar */}
      <Header
        onOpenPostNotice={handleOpenPostNotice}
        onOpenFirebaseInfo={() => setIsFirebaseModalOpen(true)}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarks={() => {
          setShowBookmarksOnly(!showBookmarksOnly);
          setSelectedNotice(null);
        }}
        bookmarkCount={bookmarkedIds.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Conditional Screen View: Notice Detail Screen vs Home Dashboard */}
        {selectedNotice ? (
          <NoticeDetailView
            notice={selectedNotice}
            onBack={handleBackToHome}
            isAdmin={isAdmin}
            onEdit={handleEditNotice}
            onDelete={handleDeleteClick}
            onTogglePin={handleTogglePin}
            isBookmarked={bookmarkedIds.includes(selectedNotice.id)}
            onToggleBookmark={handleToggleBookmark}
            onPreviewAttachment={(n) => setPreviewNotice(n)}
          />
        ) : (
          <div>
            
            {/* Welcome & Search Hero */}
            <HeroBanner
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDepartment={selectedDepartment}
              totalNotices={notices.length}
              pinnedCount={pinnedCount}
              filteredCount={displayedNotices.length}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Department Filter Section */}
            {!showBookmarksOnly && (
              <DepartmentFilter
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                departmentCounts={departmentCounts}
              />
            )}

            {/* Bookmarks Active Banner */}
            {showBookmarksOnly && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                  <Bookmark className="w-4 h-4 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
                  <span>Showing your saved notices ({displayedNotices.length})</span>
                </div>
                <button
                  onClick={() => setShowBookmarksOnly(false)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Notices
                </button>
              </div>
            )}

            {/* Notices Grid / Empty State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="h-56 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : displayedNotices.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayedNotices.map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      onSelect={handleSelectNotice}
                      isAdmin={isAdmin}
                      onEdit={handleEditNotice}
                      onDelete={handleDeleteClick}
                      onTogglePin={handleTogglePin}
                      isBookmarked={bookmarkedIds.includes(notice.id)}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Clear Empty State */
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 my-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  No Notices Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
                  {searchQuery 
                    ? `No notices match your search "${searchQuery}". Check spelling or clear search filters.`
                    : selectedDepartment !== 'All'
                    ? `No notices are currently published under the ${selectedDepartment} department.`
                    : showBookmarksOnly
                    ? "You haven't saved any notices to your bookmarks yet."
                    : "No notices available right now. Administrators can publish the first circular."}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                  {selectedDepartment !== 'All' && (
                    <button
                      onClick={() => setSelectedDepartment('All')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Show All Departments
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={handleOpenPostNotice}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Publish Notice</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              College Notice Board
            </span>
            <span aria-hidden="true">·</span>
            <span>Academic Notification System</span>
            <span aria-hidden="true">·</span>
            <span>Accredited A++</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Firestore & Storage Architecture
            </button>
            <button
              onClick={handleResetNotices}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Reset Demo Notices
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NoticeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveNotice}
        editingNotice={editingNotice}
        defaultDepartment={selectedDepartment}
      />

      <DeleteConfirmModal
        isOpen={!!noticeToDelete}
        notice={noticeToDelete}
        onClose={() => setNoticeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <LoginModal />

      <FirebaseInfoModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onResetNotices={handleResetNotices}
        notices={notices}
      />

      <AttachmentPreviewModal
        isOpen={!!previewNotice}
        notice={previewNotice}
        onClose={() => setPreviewNotice(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CollegeNoticeBoardContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
