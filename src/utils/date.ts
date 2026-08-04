// Helper function to return local calendar date YYYY-MM-DD in user's local timezone (Asia/Dhaka)
export const getLocalDateStr = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date YYYY-MM-DD to include Day of Week: e.g. "2026-08-10 (Monday)"
export const formatDateWithDay = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dateStr} (${dayOfWeek})`;
  } catch (err) {
    return dateStr;
  }
};
