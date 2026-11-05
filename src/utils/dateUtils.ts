/**
 * Formats an ISO date string into relative friendly terms:
 * "Today", "Yesterday", "2 days ago", or "Nov 5, 2026"
 */
export function formatRelativeDate(isoDateString: string): string {
  if (!isoDateString) return '';
  
  try {
    const targetDate = new Date(isoDateString);
    if (isNaN(targetDate.getTime())) return isoDateString;

    const now = new Date();
    // Normalize to midnight for calendar day diff
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const diffMs = today.getTime() - targetMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays > 1 && diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 0) {
      // Future date
      const futureDays = Math.abs(diffDays);
      if (futureDays === 1) return 'Tomorrow';
      return `In ${futureDays} days`;
    } else {
      // More than 7 days ago
      return targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  } catch {
    return isoDateString;
  }
}

/**
 * Formats date and time for detail screens
 */
export function formatFullDate(isoDateString: string): string {
  if (!isoDateString) return '';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return isoDateString;
  }
}

/**
 * Formats a Date object or ISO string to YYYY-MM-DD for <input type="date">
 */
export function toInputDateFormat(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
}
