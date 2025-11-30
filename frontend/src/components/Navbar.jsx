import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isCandidate, isRecruiter } = useAuth();

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    ⚡ AI Recruiter
                </Link>

                <div style={styles.menu}>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/jobs" style={styles.link}>
                                Browse Jobs
                            </Link>
                            <Link to="/login" style={styles.link}>
                                Login
                            </Link>
                            <Link to="/signup" style={styles.button} className="btn-primary">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            {isCandidate && (
                                <>
                                    <Link to="/jobs" style={styles.link}>
                                        Jobs
                                    </Link>
                                    <Link to="/candidate/dashboard" style={styles.link}>
                                        Dashboard
                                    </Link>
                                    <Link to="/candidate/profile" style={styles.link}>
                                        Profile
                                    </Link>
                                </>
                            )}
                            {isRecruiter && (
                                <>
                                    <Link to="/recruiter/dashboard" style={styles.link}>
                                        Dashboard
                                    </Link>
                                    <Link to="/recruiter/jobs" style={styles.link}>
                                        My Jobs
                                    </Link>
                                    <Link to="/recruiter/company" style={styles.link}>
                                        Company
                                    </Link>
                                </>
                            )}
                            <span style={styles.userName}>{user?.full_name}</span>
                            <button onClick={logout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        textDecoration: 'none',
    },
    menu: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
    },
    link: {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'color 0.3s',
    },
    button: {
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '0.6rem 1.5rem',
    },
    userName: {
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        fontWeight: '600',
    },
    logoutBtn: {
        background: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.3s',
    },
};

export default Navbar;
