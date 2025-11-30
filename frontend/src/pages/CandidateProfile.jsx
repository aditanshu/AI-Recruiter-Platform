import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { getErrorMessage } from '../utils/errorHandler';

const CandidateProfile = () => {
    const [profile, setProfile] = useState({
        headline: '',
        experience_years: 0,
        location: '',
        skills_text: '',
        phone: '',
        linkedin_url: '',
        github_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/candidates/me');
            setProfile(response.data);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError(getErrorMessage(err, 'Failed to load profile'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
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
            await apiClient.patch('/candidates/me', profile);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to update profile'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading profile...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
                <p style={styles.subtitle}>Manage your candidate information</p>
            </div>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <form onSubmit={handleSubmit} style={styles.form} className="card">
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Headline</label>
                        <input
                            type="text"
                            name="headline"
                            value={profile.headline || ''}
                            onChange={handleChange}
                            placeholder="e.g., Senior Software Engineer"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Years of Experience</label>
                        <input
                            type="number"
                            name="experience_years"
                            value={profile.experience_years || 0}
                            onChange={handleChange}
                            min="0"
                            max="50"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={profile.location || ''}
                            onChange={handleChange}
                            placeholder="e.g., San Francisco, CA"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={profile.phone || ''}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin_url"
                            value={profile.linkedin_url || ''}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>GitHub URL</label>
                        <input
                            type="url"
                            name="github_url"
                            value={profile.github_url || ''}
                            onChange={handleChange}
                            placeholder="https://github.com/yourusername"
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Skills (comma-separated)</label>
                    <textarea
                        name="skills_text"
                        value={profile.skills_text || ''}
                        onChange={handleChange}
                        placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                        rows="4"
                    />
                    <small style={styles.hint}>Separate skills with commas</small>
                </div>

                <button type="submit" disabled={saving} className="btn-primary" style={styles.button}>
                    {saving ? 'Saving...' : 'Save Profile'}
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
    hint: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    button: {
        marginTop: '1rem',
    },
};

export default CandidateProfile;
