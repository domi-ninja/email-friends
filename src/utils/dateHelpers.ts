/**
 * Formats a date as relative time (e.g., "2 minutes ago", "3 hours ago", "5 days ago")
 * @param date - The date to format (can be Date object, timestamp, or string)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | number | string): string {
    const now = new Date();
    const targetDate = new Date(date);

    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - targetDate.getTime();

    // If the date is in the future, return "just now"
    if (diffMs < 0) {
        return "just now";
    }

    // Convert to different time units
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    // Return appropriate relative time
    if (diffMinutes < 1) {
        return "just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffWeeks < 4) {
        return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    } else if (diffMonths < 12) {
        return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    } else {
        return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
    }
}

/**
 * Formats a date as a combination of date and relative time
 * @param date - The date to format
 * @returns Formatted string with both date and relative time
 */
export function formatDateWithRelativeTime(date: Date | number | string): string {
    const targetDate = new Date(date);
    const relativeTime = formatRelativeTime(date);
    const formattedDate = targetDate.toLocaleDateString();

    return `${formattedDate} (${relativeTime})`;
} 