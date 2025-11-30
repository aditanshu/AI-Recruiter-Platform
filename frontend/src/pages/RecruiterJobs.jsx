import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

const RecruiterJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/jobs/my');
            setJobs(response.data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to load jobs'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            await apiClient.delete(`/jobs/${jobId}`);
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (err) {
            alert('Failed to delete job');
        }
    };

    const filteredJobs = filter === 'all'
        ? jobs
        : jobs.filter(job => job.status === filter);

    const getStatusColor = (status) => {
        const colors = {
            draft: 'var(--text-muted)',
            published: 'var(--accent-success)',
            closed: 'var(--accent-error)',
        };
        return colors[status] || 'var(--text-secondary)';
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>My Jobs</h1>
                    <p style={styles.subtitle}>Manage your job postings</p>
                </div>
                <Link to="/recruiter/jobs/new" className="btn-primary" style={styles.createButton}>
                    <span style={styles.buttonIcon}>+</span> Post New Job
                </Link>
            </div>

            <div style={styles.filters}>
                <button
                    onClick={() => setFilter('all')}
                    style={filter === 'all' ? styles.activeFilter : styles.filterButton}
                    className="card"
                >
                    All <span style={styles.count}>({jobs.length})</span>
                </button>
                <button
                    onClick={() => setFilter('published')}
                    style={filter === 'published' ? styles.activeFilter : styles.filterButton}
                    className="card"
                >
                    Published <span style={styles.count}>({jobs.filter(j => j.status === 'published').length})</span>
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    style={filter === 'draft' ? styles.activeFilter : styles.filterButton}
                    className="card"
                >
                    Draft <span style={styles.count}>({jobs.filter(j => j.status === 'draft').length})</span>
                </button>
                <button
                    onClick={() => setFilter('closed')}
                    style={filter === 'closed' ? styles.activeFilter : styles.filterButton}
                    className="card"
                >
                    Closed <span style={styles.count}>({jobs.filter(j => j.status === 'closed').length})</span>
                </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {loading ? (
                <div style={styles.loading}>
                    <div className="spinner"></div>
                    <p>Loading jobs...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div style={styles.noJobs} className="card">
                    <div style={styles.emptyIcon}>📋</div>
                    <h3 style={styles.emptyTitle}>No jobs found</h3>
                    <p style={styles.emptyText}>
                        {filter === 'all'
                            ? "You haven't posted any jobs yet. Create your first job posting!"
                            : `No ${filter} jobs at the moment.`
                        }
                    </p>
                    {filter === 'all' && (
                        <Link to="/recruiter/jobs/new" className="btn-primary" style={styles.emptyButton}>
                            Post Your First Job
                        </Link>
                    )}
                </div>
            ) : (
                <div style={styles.jobsList}>
                    {filteredJobs.map((job) => (
                        <div key={job.id} style={styles.jobCard} className="card fade-in">
                            <div style={styles.cardHeader}>
                                <div style={styles.jobInfo}>
                                    <h3 style={styles.jobTitle}>{job.title}</h3>
                                    <p style={styles.company}>
                                        <span style={styles.companyIcon}>🏢</span>
                                        {job.company?.name}
                                    </p>
                                </div>
                                <span
                                    style={{
                                        ...styles.statusBadge,
                                        color: getStatusColor(job.status),
                                        borderColor: getStatusColor(job.status),
                                    }}
                                >
                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </span>
                            </div>

                            <div style={styles.details}>
                                <span style={styles.detail}>
                                    <span style={styles.detailIcon}>📍</span>
                                    {job.location || 'Not specified'}
                                </span>
                                <span style={styles.detail}>
                                    <span style={styles.detailIcon}>💼</span>
                                    {job.employment_type}
                                </span>
                                <span style={styles.detail}>
                                    <span style={styles.detailIcon}>🏠</span>
                                    {job.remote_type}
                                </span>
                            </div>

                            <div style={styles.cardFooter}>
                                <div style={styles.stats}>
                                    <span style={styles.stat}>
                                        <span style={styles.statIcon}>👥</span>
                                        {job.applicant_count || 0} applicants
                                    </span>
                                    <span style={styles.stat}>
                                        <span style={styles.statIcon}>📅</span>
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div style={styles.actions}>
                                    <Link to={`/recruiter/jobs/${job.id}/applicants`} style={styles.actionButton}>
                                        View Applicants
                                    </Link>
                                    <Link to={`/recruiter/jobs/${job.id}/edit`} style={styles.actionButton}>
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(job.id)} style={styles.deleteButton}>
                                        Delete
                                    </button>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1.5rem',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
    },
    createButton: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.9rem 1.8rem',
    },
    buttonIcon: {
        fontSize: '1.3rem',
        fontWeight: '700',
    },
    filters: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
    },
    filterButton: {
        padding: '0.8rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    activeFilter: {
        padding: '0.8rem 1.5rem',
        borderRadius: '12px',
        border: '2px solid var(--accent-primary)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: 'var(--accent-primary)',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '700',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    count: {
        opacity: 0.7,
        fontSize: '0.9rem',
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-error)',
        color: 'var(--accent-error)',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    loading: {
        textAlign: 'center',
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--text-secondary)',
    },
    noJobs: {
        textAlign: 'center',
        padding: '4rem 2rem',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    emptyTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
    },
    emptyText: {
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
        maxWidth: '500px',
        margin: '0 auto 2rem',
    },
    emptyButton: {
        textDecoration: 'none',
        display: 'inline-block',
    },
    jobsList: {
        display: 'grid',
        gap: '1.5rem',
    },
    jobCard: {
        padding: '1.8rem',
        transition: 'all 0.3s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1.2rem',
        gap: '1rem',
    },
    jobInfo: {
        flex: 1,
    },
    jobTitle: {
        fontSize: '1.4rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    company: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    companyIcon: {
        fontSize: '1rem',
    },
    statusBadge: {
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '700',
        border: '2px solid',
        backgroundColor: 'transparent',
        whiteSpace: 'nowrap',
    },
    details: {
        display: 'flex',
        gap: '2rem',
        marginBottom: '1.5rem',
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
    },
    detail: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    detailIcon: {
        fontSize: '1.1rem',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    stats: {
        display: 'flex',
        gap: '2rem',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    statIcon: {
        fontSize: '1rem',
    },
    actions: {
        display: 'flex',
        gap: '0.8rem',
        flexWrap: 'wrap',
    },
    actionButton: {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        border: '1px solid var(--accent-primary)',
        backgroundColor: 'transparent',
        color: 'var(--accent-primary)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'inline-block',
    },
    deleteButton: {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        border: '1px solid var(--accent-error)',
        backgroundColor: 'transparent',
        color: 'var(--accent-error)',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
};

export default RecruiterJobs;
