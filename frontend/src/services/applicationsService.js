import apiClient from './apiClient';

export const applicationsService = {
    // Apply to a job
    applyToJob: async (applicationData) => {
        const response = await apiClient.post('/applications', applicationData);
        return response.data;
    },

    // Get my applications (candidate)
    getMyApplications: async (params = {}) => {
        const response = await apiClient.get('/applications/my', { params });
        return response.data;
    },

    // Get applications for a job (recruiter)
    getJobApplications: async (jobId, params = {}) => {
        const response = await apiClient.get(`/applications/job/${jobId}`, { params });
        return response.data;
    },

    // Get single application
    getApplication: async (applicationId) => {
        const response = await apiClient.get(`/applications/${applicationId}`);
        return response.data;
    },

    // Update application status (recruiter)
    updateApplicationStatus: async (applicationId, statusData) => {
        const response = await apiClient.patch(`/applications/${applicationId}`, statusData);
        return response.data;
    },
};
