import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login({ email, password });
            if (data.user.role === 'candidate') {
                navigate('/candidate/dashboard');
            } else if (data.user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="card fade-in">
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={styles.button}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={styles.link}>
                        Sign up
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
        maxWidth: '450px',
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

export default LoginPage;
