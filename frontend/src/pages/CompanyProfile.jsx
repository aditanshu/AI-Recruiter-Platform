import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

const CompanyProfile = () => {
    const [company, setCompany] = useState({
        name: '',
        description: '',
        website: '',
        industry: '',
        size: '',
        location: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/companies/my');
            setCompany(response.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(getErrorMessage(err, 'Failed to load company profile'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            if (company.id) {
                await apiClient.put(`/companies/${company.id}`, company);
            } else {
                const response = await apiClient.post('/companies', company);
                setCompany(response.data);
            }
            setSuccess('Company profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to update company profile'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading company profile...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Company Profile</h1>
                <p style={styles.subtitle}>Manage your company information</p>
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <form onSubmit={handleSubmit} style={styles.form} className="card">
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Company Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={company.name || ''}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Acme Corporation"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Website</label>
                        <input
                            type="url"
                            name="website"
                            value={company.website || ''}
                            onChange={handleChange}
                            placeholder="https://www.example.com"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Industry</label>
                        <input
                            type="text"
                            name="industry"
                            value={company.industry || ''}
                            onChange={handleChange}
                            placeholder="e.g., Technology, Healthcare"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Company Size</label>
                        <select
                            name="size"
                            value={company.size || ''}
                            onChange={handleChange}
                        >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="501-1000">501-1000 employees</option>
                            <option value="1000+">1000+ employees</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={company.location || ''}
                            onChange={handleChange}
                            placeholder="e.g., San Francisco, CA"
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={company.description || ''}
                        onChange={handleChange}
                        placeholder="Tell candidates about your company..."
                        rows="6"
                    />
                </div>

                <button type="submit" disabled={saving} className="btn-primary" style={styles.button}>
                    {saving ? 'Saving...' : 'Save Company Profile'}
                </button>
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
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-error)',
        color: 'var(--accent-error)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
    },
    success: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid var(--accent-success)',
        color: 'var(--accent-success)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
    },
    form: {
        padding: '2rem',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    button: {
        marginTop: '1rem',
    },
};

export default CompanyProfile;
