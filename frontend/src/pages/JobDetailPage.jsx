import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { getErrorMessage } from '../utils/errorHandler';
import MatchScoreBadge from '../components/MatchScoreBadge';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isCandidate } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/jobs/${id}`);
            setJob(response.data);
        } catch (err) {
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setApplying(true);
        setError('');

        try {
            await apiClient.post('/applications', {
                job_id: id,
                cover_letter: coverLetter
            });
            setSuccess('Application submitted successfully!');
            setShowApplyForm(false);
            setTimeout(() => navigate('/candidate/dashboard'), 2000);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to submit application'));
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading job details...</div>;
    }

    if (!job) {
        return <div style={styles.error}>Job not found</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>{job.title}</h1>
                    <p style={styles.company}>{job.company?.name}</p>
                </div>
                {isCandidate && !showApplyForm && (
                    <button onClick={() => setShowApplyForm(true)} style={styles.applyButton}>
                        Apply Now
                    </button>
                )}
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}

            {showApplyForm && (
                <div style={styles.applyForm}>
                    <h3 style={styles.formTitle}>Apply for this position</h3>
                    <form onSubmit={handleApply}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Cover Letter (Optional)</label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                style={styles.textarea}
                                rows="6"
                                placeholder="Tell us why you're a great fit for this role..."
                            />
                        </div>
                        <div style={styles.formActions}>
                            <button
                                type="button"
                                onClick={() => setShowApplyForm(false)}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={applying} style={styles.submitButton}>
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={styles.content}>
                <div style={styles.mainInfo}>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Job Details</h2>
                        <div style={styles.details}>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>📍 Location:</span>
                                <span>{job.location || 'Not specified'}</span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>🏠 Remote Type:</span>
                                <span>{job.remote_type}</span>
                            </div>
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>💼 Employment Type:</span>
                                <span>{job.employment_type}</span>
                            </div>
                            {job.salary_min && job.salary_max && (
                                <div style={styles.detailItem}>
                                    <span style={styles.detailLabel}>💰 Salary:</span>
                                    <span>
                                        {job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>📊 Experience:</span>
                                <span>
                                    {job.experience_min} - {job.experience_max || '+'} years
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Description</h2>
                        <p style={styles.description}>{job.description}</p>
                    </div>

                    {job.skills_required && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Required Skills</h2>
                            <div style={styles.skills}>
                                {job.skills_required.split(',').map((skill, index) => (
                                    <span key={index} style={styles.skillBadge}>
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.sidebar}>
                    <div style={styles.sidebarCard}>
                        <h3 style={styles.sidebarTitle}>Company Info</h3>
                        <p><strong>{job.company?.name}</strong></p>
                        {job.company?.industry && <p>Industry: {job.company.industry}</p>}
                        {job.company?.size && <p>Size: {job.company.size}</p>}
                        {job.company?.location && <p>Location: {job.company.location}</p>}
                        {job.company?.website && (
                            <a
                                href={job.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.websiteLink}
                            >
                                Visit Website →
                            </a>
                        )}
                    </div>

                    <div style={styles.sidebarCard}>
                        <h3 style={styles.sidebarTitle}>Posted</h3>
                        <p>{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem',
    },
    company: {
        fontSize: '1.3rem',
        color: '#666',
    },
    applyButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '1rem 2.5rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#666',
    },
    errorBox: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '1rem',
        borderRadius: '5px',
        marginBottom: '1rem',
    },
    successBox: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '1rem',
        borderRadius: '5px',
        marginBottom: '1rem',
    },
    applyForm: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    formTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '1rem',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '0.5rem',
    },
    textarea: {
        width: '100%',
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    formActions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        color: '#333',
        padding: '0.8rem 1.5rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '0.8rem 1.5rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
    },
    mainInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    section: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '1rem',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    detailItem: {
        display: 'flex',
        gap: '0.5rem',
        fontSize: '1rem',
    },
    detailLabel: {
        fontWeight: '600',
        minWidth: '150px',
    },
    description: {
        lineHeight: '1.8',
        color: '#555',
        whiteSpace: 'pre-wrap',
    },
    skills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
    },
    skillBadge: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    sidebarCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    sidebarTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '1rem',
    },
    websiteLink: {
        display: 'inline-block',
        color: '#1976d2',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '0.5rem',
    },
};

export default JobDetailPage;
