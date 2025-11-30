import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'candidate',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await signup(formData);
            if (data.user.role === 'candidate') {
                navigate('/candidate/dashboard');
            } else if (data.user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="card fade-in">
                <h1 style={styles.title}>Create Account</h1>
                <p style={styles.subtitle}>Join AI Recruiter Platform</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            placeholder="••••••••"
                        />
                        <small style={styles.hint}>Minimum 8 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>I am a...</label>
                        <div style={styles.roleGroup}>
                            <label style={{
                                ...styles.roleOption,
                                ...(formData.role === 'candidate' ? styles.roleActive : {})
                            }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={formData.role === 'candidate'}
                                    onChange={handleChange}
                                    style={styles.radio}
                                />
                                <span>Candidate</span>
                            </label>
                            <label style={{
                                ...styles.roleOption,
                                ...(formData.role === 'recruiter' ? styles.roleActive : {})
                            }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={formData.role === 'recruiter'}
                                    onChange={handleChange}
                                    style={styles.radio}
                                />
                                <span>Recruiter</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={styles.button}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    card: {
        width: '100%',
        maxWidth: '500px',
        padding: '3rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '2rem',
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-error)',
        color: 'var(--accent-error)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
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
    roleGroup: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    roleOption: {
        padding: '1rem',
        border: '2px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        textAlign: 'center',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    roleActive: {
        borderColor: 'var(--accent-primary)',
        background: 'rgba(59, 130, 246, 0.1)',
    },
    radio: {
        display: 'none',
    },
    button: {
        width: '100%',
        marginTop: '1rem',
    },
    footer: {
        textAlign: 'center',
        marginTop: '2rem',
        color: 'var(--text-secondary)',
    },
    link: {
        color: 'var(--accent-primary)',
        textDecoration: 'none',
        fontWeight: '600',
    },
};

export default SignupPage;
