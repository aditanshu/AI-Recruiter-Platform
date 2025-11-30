import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

const JobForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        company_id: '',
        title: '',
        description: '',
        location: '',
        remote_type: 'on-site',
        employment_type: 'full-time',
        skills_required: '',
        salary_min: '',
        salary_max: '',
        currency: 'USD',
        experience_min: 0,
        experience_max: '',
        status: 'draft',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCompanies();
        if (id) {
            fetchJob();
        }
    }, [id]);

    const fetchCompanies = async () => {
        try {
            const response = await apiClient.get('/companies/my');
            setCompanies([response.data]);
            if (response.data && !formData.company_id) {
                setFormData(prev => ({ ...prev, company_id: response.data.id }));
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Please create a company profile before posting jobs. Go to Company menu.');
            } else {
                setError(getErrorMessage(err, 'Failed to load company'));
            }
        }
    };

    const fetchJob = async () => {
        try {
            const response = await apiClient.get(`/jobs/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to load job'));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.company_id) {
            setError('Please create a company profile first before posting jobs.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (id) {
                await apiClient.patch(`/jobs/${id}`, formData);
            } else {
                await apiClient.post('/jobs', formData);
            }
            navigate('/recruiter/jobs');
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to save job'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>{id ? 'Edit Job' : 'Post a New Job'}</h1>
                <p style={styles.subtitle}>Fill in the job details</p>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Job Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="e.g., Senior Software Engineer"
                    />
                </div>

                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g., San Francisco, CA"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Remote Type</label>
                        <select name="remote_type" value={formData.remote_type} onChange={handleChange} style={styles.input}>
                            <option value="on-site">On-site</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Employment Type</label>
                        <select name="employment_type" value={formData.employment_type} onChange={handleChange} style={styles.input}>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        rows="8"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Required Skills (comma-separated)</label>
                    <textarea
                        name="skills_required"
                        value={formData.skills_required}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="e.g., JavaScript, React, Node.js, Python"
                        rows="3"
                    />
                </div>

                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Min Experience (years)</label>
                        <input
                            type="number"
                            name="experience_min"
                            value={formData.experience_min}
                            onChange={handleChange}
                            style={styles.input}
                            min="0"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Max Experience (years)</label>
                        <input
                            type="number"
                            name="experience_max"
                            value={formData.experience_max}
                            onChange={handleChange}
                            style={styles.input}
                            min="0"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Min Salary</label>
                        <input
                            type="number"
                            name="salary_min"
                            value={formData.salary_min}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="50000"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Max Salary</label>
                        <input
                            type="number"
                            name="salary_max"
                            value={formData.salary_max}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="100000"
                        />
                    </div>
                </div>

                <div style={styles.buttonGroup}>
                    <button type="button" onClick={() => navigate('/recruiter/jobs')} style={styles.cancelButton}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} style={styles.submitButton}>
                        {loading ? 'Saving...' : id ? 'Update Job' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#666',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '1rem',
        borderRadius: '5px',
        marginBottom: '1rem',
    },
    form: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1.5rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
    },
    input: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    textarea: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
        marginTop: '2rem',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        color: '#333',
        padding: '1rem 2rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    submitButton: {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

export default JobForm;
