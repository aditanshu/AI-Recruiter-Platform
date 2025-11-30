import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, showCompany = true }) => {
    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>{job.title}</h3>
                {showCompany && job.company && (
                    <p style={styles.company}>{job.company.name}</p>
                )}
            </div>

            <div style={styles.details}>
                <div style={styles.detailItem}>
                    <span style={styles.icon}>📍</span>
                    <span>{job.location || 'Not specified'}</span>
                </div>
                <div style={styles.detailItem}>
                    <span style={styles.icon}>💼</span>
                    <span>{job.employment_type || 'Full-time'}</span>
                </div>
                <div style={styles.detailItem}>
                    <span style={styles.icon}>🏠</span>
                    <span>{job.remote_type || 'On-site'}</span>
                </div>
                {job.experience_min !== undefined && (
                    <div style={styles.detailItem}>
                        <span style={styles.icon}>⭐</span>
                        <span>
                            {job.experience_min}
                            {job.experience_max ? `-${job.experience_max}` : '+'} years
                        </span>
                    </div>
                )}
            </div>

            {job.salary_min && (
                <div style={styles.salary}>
                    💰 {job.currency} {job.salary_min.toLocaleString()}
                    {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                </div>
            )}

            <p style={styles.description}>
                {job.description?.substring(0, 150)}
                {job.description?.length > 150 && '...'}
            </p>

            {job.skills_required && (
                <div style={styles.skills}>
                    {job.skills_required.split(',').slice(0, 5).map((skill, index) => (
                        <span key={index} style={styles.skillTag}>
                            {skill.trim()}
                        </span>
                    ))}
                </div>
            )}

            <Link to={`/jobs/${job.id}`} style={styles.viewButton}>
                View Details →
            </Link>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    header: {
        marginBottom: '1rem',
    },
    title: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        margin: '0 0 0.5rem 0',
    },
    company: {
        color: '#666',
        fontSize: '1rem',
        margin: 0,
    },
    details: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem',
    },
    detailItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.9rem',
        color: '#555',
    },
    icon: {
        fontSize: '1rem',
    },
    salary: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: '1rem',
    },
    description: {
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '1rem',
    },
    skills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
    },
    skillTag: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
        padding: '0.3rem 0.8rem',
        borderRadius: '15px',
        fontSize: '0.85rem',
    },
    viewButton: {
        display: 'inline-block',
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '0.6rem 1.5rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
};

export default JobCard;
