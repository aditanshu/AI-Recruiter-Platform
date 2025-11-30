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
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>Login to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
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
                            style={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Login'}
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
        backgroundColor: '#f5f5f5',
        padding: '2rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '450px',
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
        transition: 'border-color 0.3s',
    },
    button: {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '1rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
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

export default LoginPage;
