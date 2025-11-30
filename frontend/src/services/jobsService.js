import apiClient from './apiClient';

export const jobsService = {
    // Get all jobs with filters
    getJobs: async (params = {}) => {
        const response = await apiClient.get('/jobs', { params });
        return response.data;
    },

    // Get single job
    getJob: async (jobId) => {
        const response = await apiClient.get(`/jobs/${jobId}`);
        return response.data;
    },

    // Create job (recruiter only)
    createJob: async (jobData) => {
        const response = await apiClient.post('/jobs', jobData);
        return response.data;
    },

    // Update job (recruiter only)
    updateJob: async (jobId, jobData) => {
        const response = await apiClient.patch(`/jobs/${jobId}`, jobData);
        return response.data;
    },

    // Delete job (recruiter only)
    deleteJob: async (jobId) => {
        await apiClient.delete(`/jobs/${jobId}`);
    },

    // Get jobs by company
    getCompanyJobs: async (companyId, params = {}) => {
        const response = await apiClient.get(`/jobs/company/${companyId}`, { params });
        return response.data;
    },
};
