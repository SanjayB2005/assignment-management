// Date formatting utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Status badge colors
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'UPLOADED':
      return 'text-blue-600 bg-blue-100';
    case 'PENDING':
      return 'text-orange-600 bg-orange-100';
    case 'COMPLETED':
      return 'text-green-600 bg-green-100';
    case 'OVERDUE':
      return 'text-red-600 bg-red-100';
    default:
      return 'gray';
  }
};

// Check if deadline is approaching (within 24 hours)
export const isDeadlineApproaching = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  
  return hoursDiff <= 24 && hoursDiff > 0;
};

// Check if deadline is passed
export const isDeadlinePassed = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return deadlineDate < now;
};

// Get time remaining until deadline
export const getTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Validate assignment code format
export const isValidAssignmentCode = (code) => {
  const codeRegex = /^[A-Z0-9]{5}$/;
  return codeRegex.test(code);
};

// Generate random colors for charts
export const generateColors = (count) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  if (count <= colors.length) {
    return colors.slice(0, count);
  }
  
  // Generate additional colors if needed
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    additionalColors.push(`hsl(${hue}, 70%, 50%)`);
  }
  
  return [...colors, ...additionalColors];
};

// Time ago formatting
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return formatDate(date);
};

// Grade calculation utilities
export const calculateGrade = (marksObtained, maxMarks) => {
  if (!marksObtained || !maxMarks) return 'N/A';
  
  const percentage = (marksObtained / maxMarks) * 100;
  
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const getGradeColor = (grade) => {
  switch (grade) {
    case 'A': return 'text-green-600 bg-green-100';
    case 'B': return 'text-blue-600 bg-blue-100';
    case 'C': return 'text-yellow-600 bg-yellow-100';
    case 'D': return 'text-orange-600 bg-orange-100';
    case 'F': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Text truncation
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};