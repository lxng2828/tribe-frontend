// Message Types
export const MESSAGE_TYPES = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    FILE: 'FILE',
    VIDEO: 'VIDEO'
};

// API Response Codes
export const API_CODES = {
    SUCCESS: '00',
    ERROR: '01',
    NOT_FOUND: '02',
    UNAUTHORIZED: '03',
    VALIDATION_ERROR: '04',
    MISSING_PARAMETER: '05',
    FILE_TOO_LARGE: '06',
    SYSTEM_ERROR: '99'
};

// File Upload Limits
export const FILE_LIMITS = {
    MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_IMAGE_SIZE: 10 * 1024 * 1024,  // 10MB
    MAX_FILE_SIZE: 50 * 1024 * 1024    // 50MB
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 20,
    MAX_SIZE: 100
};


