import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import MatchScoreBadge from '../components/MatchScoreBadge';
import { getErrorMessage } from '../utils/errorHandler';

const JobApplicants = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobAndApplicants();
    }, [jobId]);

    const fetchJobAndApplicants = async () => {
        try {
            setLoading(true);
            const [jobResponse, applicantsResponse] = await Promise.all([
                apiClient.get(`/jobs/${jobId}`),
                apiClient.get(`/applications/job/${jobId}`)
            ]);
            setJob(jobResponse.data);
            setApplicants(applicantsResponse.data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to load applicants'));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await apiClient.patch(`/applications/${applicationId}/status`, { status: newStatus });
            setApplicants(applicants.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: '#2196F3',
            screening: '#FF9800',
            shortlisted: '#4CAF50',
            interview: '#9C27B0',
            rejected: '#f44336',
            offer: '#4CAF50',
            accepted: '#4CAF50',
            declined: '#757575',
        };
        return colors[status] || '#666';
    };

    if (loading) {
        return <div style={styles.loading}>Loading applicants...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>{job?.title}</h1>
                    <p style={styles.subtitle}>{applicants.length} applicants</p>
                </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {applicants.length === 0 ? (
                <div style={styles.noApplicants}>
                    <p>No applicants yet for this job.</p>
                </div>
            ) : (
                <div style={styles.applicantsList}>
                    {applicants.map((application) => (
                        <div key={application.id} style={styles.applicantCard}>
                            <div style={styles.cardHeader}>
                                <div>
                                    <h3 style={styles.candidateName}>
                                        {application.candidate?.user?.full_name || 'Candidate'}
                                    </h3>
                                    <p style={styles.candidateHeadline}>
                                        {application.candidate?.headline || 'No headline'}
                                    </p>
                                </div>
                                <MatchScoreBadge score={application.match_score} />
                            </div>

                            <div style={styles.candidateDetails}>
                                <span>📍 {application.candidate?.location || 'Not specified'}</span>
                                <span>💼 {application.candidate?.experience_years || 0} years exp</span>
                                <span>📅 Applied {new Date(application.created_at).toLocaleDateString()}</span>
                            </div>

                            {application.candidate?.skills_text && (
                                <div style={styles.skills}>
                                    <strong>Skills:</strong> {application.candidate.skills_text}
                                </div>
                            )}

                            {application.cover_letter && (
                                <div style={styles.coverLetter}>
                                    <strong>Cover Letter:</strong>
                                    <p>{application.cover_letter}</p>
                                </div>
                            )}

                            <div style={styles.cardFooter}>
                                <div style={styles.statusSection}>
                                    <label style={styles.statusLabel}>Status:</label>
                                    <select
                                        value={application.status}
                                        onChange={(e) => handleStatusChange(application.id, e.target.value)}
                                        style={{
                                            ...styles.statusSelect,
                                            backgroundColor: getStatusColor(application.status),
                                        }}
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="screening">Screening</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="interview">Interview</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="offer">Offer</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="declined">Declined</option>
                                    </select>
                                </div>

                                <div style={styles.actions}>
                                    {application.candidate?.resume_url && (
                                        <a
                                            href={application.candidate.resume_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.actionButton}
                                        >
                                            View Resume
                                        </a>
                                    )}
                                    {application.candidate?.linkedin_url && (
                                        <a
                                            href={application.candidate.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.actionButton}
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#666',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '1rem',
        borderRadius: '5px',
        marginBottom: '1rem',
    },
    noApplicants: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '10px',
    },
    applicantsList: {
        display: 'grid',
        gap: '1.5rem',
    },
    applicantCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem',
    },
    candidateName: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        margin: 0,
    },
    candidateHeadline: {
        color: '#666',
        marginTop: '0.3rem',
        fontStyle: 'italic',
    },
    candidateDetails: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#555',
        flexWrap: 'wrap',
    },
    skills: {
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#555',
    },
    coverLetter: {
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px',
        fontSize: '0.9rem',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    statusSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    statusLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    statusSelect: {
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        border: 'none',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    actionButton: {
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: '1px solid #1976d2',
        backgroundColor: 'white',
        color: '#1976d2',
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
};

export default JobApplicants;
