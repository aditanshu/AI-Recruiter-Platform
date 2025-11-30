// Utility function to extract error message from API responses
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
    if (!error) return defaultMessage;

    // Check if error.response.data.detail exists
    if (error.response?.data?.detail) {
        const detail = error.response.data.detail;

        // If detail is a string, return it
        if (typeof detail === 'string') {
            return detail;
        }

        // If detail is an array (validation errors), extract first message
        if (Array.isArray(detail)) {
            if (detail.length > 0 && detail[0].msg) {
                return detail[0].msg;
            }
            return defaultMessage;
        }

        // If detail is an object, try to extract message
        if (typeof detail === 'object' && detail.msg) {
            return detail.msg;
        }
    }

    // Check for error.message
    if (error.message) {
        return error.message;
    }

    return defaultMessage;
};
