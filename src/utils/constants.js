// src/utils/constants.js

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  USER: 'user',
  SERVICEMAN: 'serviceman',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

// Role-based dashboard paths
export const DASHBOARD_PATHS = {
  [ROLES.USER]: '/user/dashboard',
  [ROLES.SERVICEMAN]: '/serviceman/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SUPERADMIN]: '/superadmin/dashboard'
};

// Booking Status
// export const BOOKING_STATUS = {
//   PENDING: 'pending',
//   ACCEPTED: 'accepted',
//   REJECTED: 'rejected',
//   COMPLETED: 'completed',
//   CANCELLED: 'cancelled'
// };

// Service Categories (you can expand these based on your data)
export const SERVICE_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: 'FaWrench' },
  { id: 'electrical', name: 'Electrical', icon: 'FaBolt' },
  { id: 'ac', name: 'AC Repair', icon: 'FaSnowflake' },
  { id: 'carpentry', name: 'Carpentry', icon: 'FaTools' },
  { id: 'painting', name: 'Painting', icon: 'FaPaintBrush' },
  { id: 'cleaning', name: 'Cleaning', icon: 'FaBroom' }
];

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  REGISTER_SUCCESS: 'Registration successful!',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  LOGOUT_SUCCESS: 'Logged out successfully',
  BOOKING_SUCCESS: 'Booking created successfully!',
  BOOKING_ERROR: 'Failed to create booking. Please try again.',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  PROFILE_UPDATE_ERROR: 'Failed to update profile.',
  // Admin specific messages
  ADMIN_CREATE_SUCCESS: 'Admin created successfully!',
  ADMIN_CREATE_ERROR: 'Failed to create admin.',
  ADMIN_UPDATE_SUCCESS: 'Admin updated successfully!',
  ADMIN_UPDATE_ERROR: 'Failed to update admin.',
  ADMIN_DELETE_SUCCESS: 'Admin deleted successfully!',
  ADMIN_DELETE_ERROR: 'Failed to delete admin.',
  ADMIN_STATUS_UPDATE_SUCCESS: 'Admin status updated successfully!',
  ADMIN_STATUS_UPDATE_ERROR: 'Failed to update admin status.'
};

// Animation Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY • hh:mm A',
  API: 'YYYY-MM-DD',
  API_FULL: 'YYYY-MM-DDTHH:mm:ss.sssZ'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100]
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [77.5946, 12.9716], // Bangalore coordinates [lng, lat]
  DEFAULT_ZOOM: 12,
  SEARCH_RADIUS: 5000 // meters
};

// Rating Options
// export const RATING_OPTIONS = [1, 2, 3, 4, 5];

// Price Ranges (for filtering)
export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: Infinity }
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' }
];

// Days of Week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Months
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// ============================================
// NEW ADMIN/SUPERADMIN SPECIFIC CONSTANTS
// ============================================

// Admin filter options
export const ADMIN_FILTER_OPTIONS = {
  STATUS: {
    ALL: '',
    ACTIVE: 'true',
    INACTIVE: 'false'
  },
  SORT: {
    NEWEST: '-createdAt',
    OLDEST: 'createdAt',
    NAME_ASC: 'name',
    NAME_DESC: '-name'
  }
};

// Delete types
export const DELETE_TYPES = {
  SOFT: 'soft',
  PERMANENT: 'permanent'
};

// Confirmation modal colors
export const CONFIRMATION_COLORS = {
  RED: 'red',
  YELLOW: 'yellow',
  BLUE: 'blue',
  GREEN: 'green'
};

// Admin status colors
export const ADMIN_STATUS_COLORS = {
  ACTIVE: 'green',
  INACTIVE: 'red'
};

// Admin status texts
export const ADMIN_STATUS_TEXTS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Admin table headers
export const ADMIN_TABLE_HEADERS = [
  { key: 'admin', label: 'Admin' },
  { key: 'contact', label: 'Contact' },
  { key: 'status', label: 'Status' },
  { key: 'created', label: 'Created' },
  { key: 'actions', label: 'Actions' }
];

// Default admin form data
export const DEFAULT_ADMIN_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  address: ''
};

// Dashboard stats card colors
export const STATS_CARD_COLORS = {
  BLUE: 'from-blue-500 to-blue-600',
  GREEN: 'from-green-500 to-green-600',
  RED: 'from-red-500 to-red-600',
  PURPLE: 'from-purple-500 to-purple-600',
  YELLOW: 'from-yellow-500 to-yellow-600'
};

// Dashboard stats card bg colors
export const STATS_CARD_BG_COLORS = {
  BLUE: 'bg-blue-500/10',
  GREEN: 'bg-green-500/10',
  RED: 'bg-red-500/10',
  PURPLE: 'bg-purple-500/10',
  YELLOW: 'bg-yellow-500/10'
};

// Sidebar menu items (will be used in Sidebar component)
export const SIDEBAR_MENU_ITEMS = {
  [ROLES.SUPERADMIN]: [
    { path: '/superadmin/dashboard', icon: 'FaTachometerAlt', label: 'Dashboard' },
    { path: '/superadmin/create-admin', icon: 'FaUserPlus', label: 'Create Admin' },
    { path: '/superadmin/admins', icon: 'FaUsers', label: 'All Admins' },
    { path: '/superadmin/settings', icon: 'FaCog', label: 'Settings' }
  ],
  [ROLES.ADMIN]: [
    { path: '/admin/dashboard', icon: 'FaTachometerAlt', label: 'Dashboard' },
    { path: '/admin/users', icon: 'FaUsers', label: 'Manage Users' },
    { path: '/admin/servicemen', icon: 'FaUserTie', label: 'Manage ServiceMen' },
    { path: '/admin/categories', icon: 'FaWrench', label: 'Categories' },
    { path: '/admin/bookings', icon: 'FaClipboardList', label: 'All Bookings' },
    { path: '/admin/reports', icon: 'FaChartBar', label: 'Reports' }
  ],
  [ROLES.SERVICEMAN]: [
    { path: '/serviceman/dashboard', icon: 'FaTachometerAlt', label: 'Dashboard' },
    { path: '/serviceman/profile', icon: 'FaUserTie', label: 'My Profile' },
    { path: '/serviceman/jobs', icon: 'FaCalendarAlt', label: 'My Jobs' },
    { path: '/serviceman/availability', icon: 'FaMapMarkerAlt', label: 'Availability' },
    { path: '/serviceman/reviews', icon: 'FaStar', label: 'My Reviews' }
  ],
  [ROLES.USER]: [
    { path: '/user/dashboard', icon: 'FaTachometerAlt', label: 'Dashboard' },
    { path: '/user/browse', icon: 'FaWrench', label: 'Browse Services' },
    { path: '/user/bookings', icon: 'FaCalendarAlt', label: 'My Bookings' },
    { path: '/user/reviews', icon: 'FaStar', label: 'My Reviews' },
    { path: '/user/profile', icon: 'FaUserTie', label: 'Profile' }
  ]
};

// Icon mapping (for dynamic icon rendering)
export const ICON_MAP = {
  FaTachometerAlt: 'FaTachometerAlt',
  FaUserPlus: 'FaUserPlus',
  FaUsers: 'FaUsers',
  FaCog: 'FaCog',
  FaUserTie: 'FaUserTie',
  FaWrench: 'FaWrench',
  FaClipboardList: 'FaClipboardList',
  FaChartBar: 'FaChartBar',
  FaCalendarAlt: 'FaCalendarAlt',
  FaMapMarkerAlt: 'FaMapMarkerAlt',
  FaStar: 'FaStar',
  FaUser: 'FaUser',
  FaEnvelope: 'FaEnvelope',
  FaLock: 'FaLock',
  FaPhone: 'FaPhone',
  FaMapMarkerAlt: 'FaMapMarkerAlt',
  FaArrowLeft: 'FaArrowLeft',
  FaArrowRight: 'FaArrowRight',
  FaSearch: 'FaSearch',
  FaFilter: 'FaFilter',
  FaEye: 'FaEye',
  FaTrash: 'FaTrash',
  FaToggleOn: 'FaToggleOn',
  FaToggleOff: 'FaToggleOff',
  FaEdit: 'FaEdit',
  FaCheckCircle: 'FaCheckCircle',
  FaTimesCircle: 'FaTimesCircle',
  FaExclamationTriangle: 'FaExclamationTriangle',
  FaTimes: 'FaTimes'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  
  // Admin specific errors
  ADMIN_NOT_FOUND: 'Admin not found.',
  ADMIN_CREATE_FAILED: 'Failed to create admin. Please try again.',
  ADMIN_UPDATE_FAILED: 'Failed to update admin. Please try again.',
  ADMIN_DELETE_FAILED: 'Failed to delete admin. Please try again.',
  ADMIN_STATUS_UPDATE_FAILED: 'Failed to update admin status. Please try again.',
  CANNOT_DELETE_SELF: 'Super admin cannot delete themselves.',
  CANNOT_UPDATE_OWN_STATUS: 'Super admin cannot change their own status.',

    FETCH_USERS: 'Failed to fetch users. Please try again.',
  FETCH_SERVICEMEN: 'Failed to fetch servicemen. Please try again.',
  FETCH_CATEGORIES: 'Failed to fetch categories. Please try again.',
  FETCH_BOOKINGS: 'Failed to fetch bookings. Please try again.',
  CREATE_USER: 'Failed to create user. Please check your input.',
  UPDATE_USER: 'Failed to update user. Please try again.',
  DELETE_USER: 'Failed to delete user. Please try again.',
  RESET_PASSWORD: 'Failed to reset password. Please try again.',
  BULK_ACTION: 'Failed to perform bulk action. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  ADMIN_CREATED: 'Admin created successfully!',
  ADMIN_UPDATED: 'Admin updated successfully!',
  ADMIN_DELETED: 'Admin deleted successfully!',
  ADMIN_ACTIVATED: 'Admin activated successfully!',
  ADMIN_DEACTIVATED: 'Admin deactivated successfully!',


    USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  USER_ACTIVATED: 'User activated successfully!',
  USER_DEACTIVATED: 'User deactivated successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  BULK_ACTION_COMPLETE: 'Bulk action completed successfully!'
};

// Loading messages
export const LOADING_MESSAGES = {
  FETCHING_ADMINS: 'Fetching admins...',
  CREATING_ADMIN: 'Creating admin...',
  UPDATING_ADMIN: 'Updating admin...',
  DELETING_ADMIN: 'Deleting admin...'
};


// Add these to your existing constants.js

// Admin Dashboard Constants
export const DASHBOARD_STATS = [
  { key: 'totalUsers', label: 'Total Users', icon: 'FaUsers', color: 'from-blue-500 to-blue-600' },
  { key: 'totalServicemen', label: 'Total Servicemen', icon: 'FaUserTie', color: 'from-purple-500 to-purple-600' },
  { key: 'activeServicemen', label: 'Active Servicemen', icon: 'FaUserCheck', color: 'from-green-500 to-green-600' },
  { key: 'totalBookings', label: 'Total Bookings', icon: 'FaCalendarCheck', color: 'from-yellow-500 to-yellow-600' }
];

// Booking Status Colors
export const BOOKING_STATUS_COLORS = {
  'Completed': 'bg-green-500/20 text-green-400',
  'InProgress': 'bg-blue-500/20 text-blue-400',
  'Pending': 'bg-yellow-500/20 text-yellow-400',
  'Approved': 'bg-purple-500/20 text-purple-400',
  'Cancelled': 'bg-red-500/20 text-red-400',
  'Rejected': 'bg-gray-500/20 text-gray-400'
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  gray: '#6B7280'
};

// Time periods for filtering
export const TIME_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];


// Add these to your constants.js file

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_DOC_TYPES: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
};

// Serviceman Availability Status
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  OFFLINE: 'Offline'
};

// Serviceman Availability Colors
export const AVAILABILITY_COLORS = {
  [AVAILABILITY_STATUS.AVAILABLE]: 'bg-green-500/20 text-green-400',
  [AVAILABILITY_STATUS.BUSY]: 'bg-yellow-500/20 text-yellow-400',
  [AVAILABILITY_STATUS.OFFLINE]: 'bg-gray-500/20 text-gray-400'
};

// Skill Levels
export const SKILL_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  EXPERT: 'Expert'
};

// Document Types
export const DOCUMENT_TYPES = {
  ID_PROOF: 'ID Proof',
  ADDRESS_PROOF: 'Address Proof',
  CERTIFICATE: 'Certificate',
  OTHER: 'Other'
};

// Bulk Action Types
export const BULK_ACTIONS = {
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  DELETE: 'delete'
};

// Confirmation Messages
export const CONFIRMATION_MESSAGES = {
  DELETE_USER: 'Are you sure you want to delete this user? This action cannot be undone.',
  DELETE_SERVICEMAN: 'Are you sure you want to delete this serviceman? All associated data will be lost.',
  DELETE_CATEGORY: 'Are you sure you want to delete this category? This may affect servicemen using this category.',
  DEACTIVATE_USER: 'Are you sure you want to deactivate this user? They will not be able to log in.',
  DEACTIVATE_SERVICEMAN: 'Are you sure you want to deactivate this serviceman? They will not receive new bookings.',
  DEACTIVATE_CATEGORY: 'Are you sure you want to deactivate this category? It will not be visible to users.',
  RESET_PASSWORD: 'Are you sure you want to reset this user\'s password? They will need to use the new password to log in.'
};

// Table Column Widths (for consistent layout)
export const TABLE_COLUMN_WIDTHS = {
  SELECTOR: 'w-10',
  USER_INFO: 'w-1/4',
  CONTACT: 'w-1/5',
  ROLE: 'w-24',
  STATUS: 'w-24',
  DATE: 'w-32',
  ACTIONS: 'w-40'
};

// Date Format Options
export const DATE_FORMAT_OPTIONS = {
  FULL: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  },
  SHORT: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  TIME_ONLY: {
    hour: '2-digit',
    minute: '2-digit'
  }
};

// Empty States Messages
export const EMPTY_STATES = {
  USERS: 'No users found matching your criteria',
  SERVICEMEN: 'No servicemen found matching your criteria',
  CATEGORIES: 'No categories found',
  BOOKINGS: 'No bookings found',
  REVIEWS: 'No reviews yet'
};

// Error Messages
// export const ERROR_MESSAGES = {
//   FETCH_USERS: 'Failed to fetch users. Please try again.',
//   FETCH_SERVICEMEN: 'Failed to fetch servicemen. Please try again.',
//   FETCH_CATEGORIES: 'Failed to fetch categories. Please try again.',
//   FETCH_BOOKINGS: 'Failed to fetch bookings. Please try again.',
//   CREATE_USER: 'Failed to create user. Please check your input.',
//   UPDATE_USER: 'Failed to update user. Please try again.',
//   DELETE_USER: 'Failed to delete user. Please try again.',
//   RESET_PASSWORD: 'Failed to reset password. Please try again.',
//   BULK_ACTION: 'Failed to perform bulk action. Please try again.'
// };

// // Success Messages
// export const SUCCESS_MESSAGES = {
//   USER_CREATED: 'User created successfully!',
//   USER_UPDATED: 'User updated successfully!',
//   USER_DELETED: 'User deleted successfully!',
//   USER_ACTIVATED: 'User activated successfully!',
//   USER_DEACTIVATED: 'User deactivated successfully!',
//   PASSWORD_RESET: 'Password reset successfully!',
//   BULK_ACTION_COMPLETE: 'Bulk action completed successfully!'
// };

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PRICE: 'Price must be greater than 0',
  INVALID_EXPERIENCE: 'Experience must be a positive number',
  INVALID_SKILLS: 'Please enter at least one skill'
};


// Add these to your constants.js

// Availability Status
// export const AVAILABILITY_STATUS = {
//   AVAILABLE: 'Available',
//   BUSY: 'Busy',
//   OFFLINE: 'Offline'
// };

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// Status Update Options (for serviceman)
export const STATUS_UPDATE_OPTIONS = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED],
  [BOOKING_STATUS.APPROVED]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED]
};

// Rating Options
export const RATING_OPTIONS = [
  { value: 5, label: 'Excellent' },
  { value: 4, label: 'Good' },
  { value: 3, label: 'Average' },
  { value: 2, label: 'Poor' },
  { value: 1, label: 'Terrible' }
];

// Default Location (if user denies permission)
export const DEFAULT_LOCATION = {
  lat: 12.9716, // Bangalore
  lng: 77.5946
};

// Search Radius Options (in meters)
export const RADIUS_OPTIONS = [
  { value: 5000, label: '5 km' },
  { value: 10000, label: '10 km' },
  { value: 20000, label: '20 km' },
  { value: 50000, label: '50 km' }
];

// Sort Options for Servicemen
export const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experienced' }
];

// Review Messages
export const REVIEW_MESSAGES = {
  ADD_SUCCESS: 'Review added successfully!',
  ADD_ERROR: 'Failed to add review. Please try again.',
  UPDATE_SUCCESS: 'Review updated successfully!',
  UPDATE_ERROR: 'Failed to update review.',
  DELETE_SUCCESS: 'Review deleted successfully!',
  DELETE_ERROR: 'Failed to delete review.'
};

// Booking Messages
export const BOOKING_MESSAGES = {
  CREATE_SUCCESS: 'Booking created successfully!',
  CREATE_ERROR: 'Failed to create booking.',
  CANCEL_SUCCESS: 'Booking cancelled successfully!',
  CANCEL_ERROR: 'Failed to cancel booking.',
  STATUS_UPDATE_SUCCESS: 'Booking status updated successfully!',
  STATUS_UPDATE_ERROR: 'Failed to update booking status.'
};

// Location Messages
export const LOCATION_MESSAGES = {
  GET_SUCCESS: 'Location retrieved successfully!',
  GET_ERROR: 'Failed to get location. Please enable location services.',
  UPDATE_SUCCESS: 'Location updated successfully!',
  UPDATE_ERROR: 'Failed to update location.'
};


