import React, { useState, useEffect } from 'react';
import { applicationsService } from '../services/applicationsService';
import { useAuth } from '../context/AuthContext';
import MatchScoreBadge from '../components/MatchScoreBadge';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationsService.getMyApplications();
            setApplications(data);
            setError('');
        } catch (err) {
            // Don't show error if it's just empty (404 is expected for new users)
            if (err.response?.status === 404) {
                setApplications([]);
            } else {
                setError('Failed to load applications.');
            }
        } finally {
            setLoading(false);
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

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Welcome back, {user?.full_name}!</h1>
                <p style={styles.subtitle}>Track your job applications</p>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{applications.length}</div>
                    <div style={styles.statLabel}>Total Applications</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>
                        {applications.filter((a) => a.status === 'shortlisted').length}
                    </div>
                    <div style={styles.statLabel}>Shortlisted</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>
                        {applications.filter((a) => a.status === 'interview').length}
                    </div>
                    <div style={styles.statLabel}>Interviews</div>
                </div>
            </div>

            <div style={styles.quickActions}>
                <Link to="/candidate/profile" style={styles.actionCard}>
                    <div style={styles.actionIcon}>👤</div>
                    <h3 style={styles.actionTitle}>My Profile</h3>
                    <p style={styles.actionText}>Update your information</p>
                </Link>
                <Link to="/jobs" style={styles.actionCard}>
                    <div style={styles.actionIcon}>🔍</div>
                    <h3 style={styles.actionTitle}>Browse Jobs</h3>
                    <p style={styles.actionText}>Find your next opportunity</p>
                </Link>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {loading ? (
                <div style={styles.loading}>Loading applications...</div>
            ) : applications.length === 0 ? (
                <div style={styles.noApplications}>
                    <p>You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" style={styles.browseButton}>
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div style={styles.applicationsList}>
                    {applications.map((app) => (
                        <div key={app.id} style={styles.applicationCard}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.jobTitle}>{app.job?.title}</h3>
                                <MatchScoreBadge score={app.match_score} />
                            </div>

                            <p style={styles.company}>{app.job?.company?.name}</p>

                            <div style={styles.details}>
                                <span>📍 {app.job?.location}</span>
                                <span>💼 {app.job?.employment_type}</span>
                                <span>🏠 {app.job?.remote_type}</span>
                            </div>

                            <div style={styles.cardFooter}>
                                <span
                                    style={{
                                        ...styles.statusBadge,
                                        backgroundColor: getStatusColor(app.status),
                                    }}
                                >
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                                <span style={styles.date}>
                                    Applied: {new Date(app.created_at).toLocaleDateString()}
                                </span>
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
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '0.9rem',
        color: '#666',
    },
    quickActions: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    actionCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    actionIcon: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
    },
    actionTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.3rem',
    },
    actionText: {
        color: '#666',
        fontSize: '0.85rem',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '1rem',
        borderRadius: '5px',
        marginBottom: '1rem',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#666',
    },
    noApplications: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '10px',
    },
    browseButton: {
        display: 'inline-block',
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '0.8rem 2rem',
        borderRadius: '5px',
        textDecoration: 'none',
        marginTop: '1rem',
        fontWeight: 'bold',
    },
    applicationsList: {
        display: 'grid',
        gap: '1.5rem',
    },
    applicationCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '0.5rem',
    },
    jobTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        margin: 0,
    },
    company: {
        color: '#666',
        marginBottom: '1rem',
    },
    details: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#555',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    date: {
        fontSize: '0.85rem',
        color: '#999',
    },
};

export default CandidateDashboard;
