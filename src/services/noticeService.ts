import { Department, Notice } from '../types/notice';
import { INITIAL_NOTICES } from '../data/initialNotices';

const STORAGE_KEY = 'college_notice_board_notices_v1';
const BOOKMARKS_KEY = 'college_notice_board_bookmarks_v1';

export class NoticeService {
  /**
   * Retrieves all notices from storage, initializing with initial sample data if empty.
   */
  static getNotices(): Notice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveNotices(INITIAL_NOTICES);
        return INITIAL_NOTICES;
      }
      const parsed: Notice[] = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveNotices(INITIAL_NOTICES);
        return INITIAL_NOTICES;
      }
      return parsed;
    } catch (e) {
      console.warn('Error reading notices from localStorage:', e);
      return INITIAL_NOTICES;
    }
  }

  /**
   * Saves notices to localStorage.
   */
  static saveNotices(notices: Notice[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.error('Error saving notices to localStorage:', e);
    }
  }

  /**
   * Returns a single notice by ID.
   */
  static getNoticeById(id: string): Notice | undefined {
    const list = this.getNotices();
    return list.find(n => n.id === id);
  }

  /**
   * Checks if a notice with identical or almost identical title already exists
   * to satisfy requirement: "Prevent accidental duplicate submissions"
   */
  static checkDuplicateTitle(title: string, excludeId?: string): boolean {
    const cleanTitle = title.trim().toLowerCase();
    const list = this.getNotices();
    return list.some(n => {
      if (excludeId && n.id === excludeId) return false;
      return n.title.trim().toLowerCase() === cleanTitle;
    });
  }

  /**
   * Creates and persists a new notice.
   */
  static createNotice(
    newNoticeData: Omit<Notice, 'id' | 'createdAt' | 'viewsCount'>
  ): Notice {
    const notices = this.getNotices();
    const id = `notice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const created: Notice = {
      ...newNoticeData,
      id,
      viewsCount: 1,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Prepend to list
    const updated = [created, ...notices];
    this.saveNotices(updated);
    return created;
  }

  /**
   * Updates an existing notice.
   */
  static updateNotice(
    id: string,
    updates: Partial<Omit<Notice, 'id' | 'createdAt' | 'viewsCount'>>
  ): Notice | null {
    const notices = this.getNotices();
    const index = notices.findIndex(n => n.id === id);
    if (index === -1) return null;

    const updatedNotice: Notice = {
      ...notices[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    notices[index] = updatedNotice;
    this.saveNotices(notices);
    return updatedNotice;
  }

  /**
   * Deletes a notice by ID.
   */
  static deleteNotice(id: string): boolean {
    const notices = this.getNotices();
    const filtered = notices.filter(n => n.id !== id);
    if (filtered.length === notices.length) return false;
    this.saveNotices(filtered);
    return true;
  }

  /**
   * Toggles pinned/important state of a notice.
   */
  static togglePin(id: string): Notice | null {
    const notices = this.getNotices();
    const notice = notices.find(n => n.id === id);
    if (!notice) return null;
    notice.isPinned = !notice.isPinned;
    notice.updatedAt = new Date().toISOString();
    this.saveNotices(notices);
    return notice;
  }

  /**
   * Increments view count for a notice.
   */
  static incrementView(id: string): void {
    const notices = this.getNotices();
    const notice = notices.find(n => n.id === id);
    if (notice) {
      notice.viewsCount = (notice.viewsCount || 0) + 1;
      this.saveNotices(notices);
    }
  }

  /**
   * Resets notices to initial demo data.
   */
  static resetToInitial(): Notice[] {
    this.saveNotices(INITIAL_NOTICES);
    return INITIAL_NOTICES;
  }

  /**
   * Sorts notices: pinned first, then by publishedDate descending (latest first).
   */
  static sortNotices(notices: Notice[]): Notice[] {
    return [...notices].sort((a, b) => {
      // Pinned notices first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Newest publishedDate first
      const timeA = new Date(a.publishedDate).getTime();
      const timeB = new Date(b.publishedDate).getTime();
      return timeB - timeA;
    });
  }

  /**
   * Calculates department-wise counts including 'All'.
   */
  static getDepartmentCounts(notices: Notice[]): Record<Department, number> {
    const counts: Record<Department, number> = {
      All: notices.length,
      CSE: 0,
      AIML: 0,
      ECE: 0,
      EEE: 0,
      Mechanical: 0,
      Civil: 0,
      General: 0
    };

    notices.forEach(n => {
      if (counts[n.department] !== undefined) {
        counts[n.department]++;
      }
    });

    return counts;
  }

  /**
   * Gets bookmarked notice IDs.
   */
  static getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Toggles bookmark for a notice.
   */
  static toggleBookmark(noticeId: string): string[] {
    const bookmarks = this.getBookmarks();
    const exists = bookmarks.includes(noticeId);
    const updated = exists 
      ? bookmarks.filter(id => id !== noticeId) 
      : [...bookmarks, noticeId];
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  }
}
