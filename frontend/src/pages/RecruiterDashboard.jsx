import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplicants: 0,
        interviewsScheduled: 0,
    });
    const { user } = useAuth();

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Welcome back, {user?.full_name}!</h1>
                <p style={styles.subtitle}>Manage your job postings and candidates</p>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.totalJobs}</div>
                    <div style={styles.statLabel}>Active Jobs</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.totalApplicants}</div>
                    <div style={styles.statLabel}>Total Applicants</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.interviewsScheduled}</div>
                    <div style={styles.statLabel}>Interviews Scheduled</div>
                </div>
            </div>

            <div style={styles.actions}>
                <Link to="/recruiter/company" style={styles.actionCard}>
                    <div style={styles.actionIcon}>🏢</div>
                    <h3 style={styles.actionTitle}>Company Profile</h3>
                    <p style={styles.actionText}>Manage your company information</p>
                </Link>

                <Link to="/recruiter/jobs/new" style={styles.actionCard}>
                    <div style={styles.actionIcon}>➕</div>
                    <h3 style={styles.actionTitle}>Post a Job</h3>
                    <p style={styles.actionText}>Create a new job posting</p>
                </Link>

                <Link to="/recruiter/jobs" style={styles.actionCard}>
                    <div style={styles.actionIcon}>📋</div>
                    <h3 style={styles.actionTitle}>My Jobs</h3>
                    <p style={styles.actionText}>View and manage your job listings</p>
                </Link>

                <Link to="/recruiter/interviews" style={styles.actionCard}>
                    <div style={styles.actionIcon}>📅</div>
                    <h3 style={styles.actionTitle}>Interviews</h3>
                    <p style={styles.actionText}>View scheduled interviews</p>
                </Link>
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
        marginBottom: '3rem',
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
    actions: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
    },
    actionCard: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    actionIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    actionTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem',
    },
    actionText: {
        color: '#666',
        fontSize: '0.9rem',
    },
};

export default RecruiterDashboard;
