import React, { useState, useEffect } from 'react';
import { jobsService } from '../services/jobsService';
import JobCard from '../components/JobCard';

const JobListPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        remote_type: '',
        skills: '',
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobsService.getJobs(filters);
            setJobs(data);
        } catch (err) {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleClearFilters = () => {
        setFilters({
            title: '',
            location: '',
            remote_type: '',
            skills: '',
        });
        setTimeout(fetchJobs, 100);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Browse Jobs</h1>
                <p style={styles.subtitle}>Find your next opportunity with AI-powered matching</p>
            </div>

            <div style={styles.filterSection}>
                <form onSubmit={handleSearch} style={styles.filterForm}>
                    <input
                        type="text"
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                        placeholder="Job title..."
                        style={styles.filterInput}
                    />
                    <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        placeholder="Location..."
                        style={styles.filterInput}
                    />
                    <select
                        name="remote_type"
                        value={filters.remote_type}
                        onChange={handleFilterChange}
                        style={styles.filterSelect}
                    >
                        <option value="">All Types</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="on-site">On-site</option>
                    </select>
                    <input
                        type="text"
                        name="skills"
                        value={filters.skills}
                        onChange={handleFilterChange}
                        placeholder="Skills (comma-separated)..."
                        style={styles.filterInput}
                    />
                    <button type="submit" style={styles.searchButton}>
                        🔍 Search
                    </button>
                    <button type="button" onClick={handleClearFilters} style={styles.clearButton}>
                        Clear
                    </button>
                </form>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            {loading ? (
                <div style={styles.loading}>Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div style={styles.noResults}>
                    <p>No jobs found matching your criteria.</p>
                    <button onClick={handleClearFilters} style={styles.clearButton}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div style={styles.jobsGrid}>
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
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
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#666',
    },
    filterSection: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    filterForm: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    filterInput: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '0.95rem',
    },
    filterSelect: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '0.95rem',
        backgroundColor: 'white',
    },
    searchButton: {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '0.8rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    clearButton: {
        backgroundColor: '#f5f5f5',
        color: '#666',
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '0.95rem',
        cursor: 'pointer',
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
    noResults: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '10px',
    },
    jobsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
    },
};

export default JobListPage;
