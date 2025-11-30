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
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
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
                            style={styles.input}
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
                            style={styles.input}
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
                            style={styles.input}
                            placeholder="••••••••"
                        />
                        <small style={styles.hint}>Minimum 8 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>I am a...</label>
                        <div style={styles.radioGroup}>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={formData.role === 'candidate'}
                                    onChange={handleChange}
                                    style={styles.radio}
                                />
                                <span>Candidate (Looking for jobs)</span>
                            </label>
                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={formData.role === 'recruiter'}
                                    onChange={handleChange}
                                    style={styles.radio}
                                />
                                <span>Recruiter (Hiring talent)</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Creating account...' : 'Sign Up'}
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
        backgroundColor: '#f5f5f5',
        padding: '2rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        marginBottom: '2rem',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '1rem',
        borderRadius: '5px',
        marginBottom: '1rem',
        fontSize: '0.9rem',
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
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
    },
    input: {
        padding: '0.8rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    hint: {
        fontSize: '0.8rem',
        color: '#999',
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
    },
    radio: {
        cursor: 'pointer',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '1rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    footer: {
        textAlign: 'center',
        marginTop: '2rem',
        color: '#666',
    },
    link: {
        color: '#1976d2',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default SignupPage;
