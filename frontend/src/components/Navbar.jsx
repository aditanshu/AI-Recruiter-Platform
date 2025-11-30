import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, isCandidate, isRecruiter } = useAuth();

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    🤖 AI Recruiter
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
                            <Link to="/signup" style={styles.button}>
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
                                    <Link to="/dashboard" style={styles.link}>
                                        My Applications
                                    </Link>
                                    <Link to="/profile" style={styles.link}>
                                        Profile
                                    </Link>
                                </>
                            )}
                            {isRecruiter && (
                                <>
                                    <Link to="/dashboard" style={styles.link}>
                                        Dashboard
                                    </Link>
                                    <Link to="/jobs/new" style={styles.link}>
                                        Post Job
                                    </Link>
                                    <Link to="/company" style={styles.link}>
                                        Company
                                    </Link>
                                </>
                            )}
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{user?.full_name}</span>
                                <button onClick={logout} style={styles.logoutBtn}>
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#1a1a2e',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#fff',
        textDecoration: 'none',
    },
    menu: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    },
    link: {
        color: '#e0e0e0',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'color 0.3s',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '0.5rem 1.5rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'background-color 0.3s',
    },
    userInfo: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    userName: {
        color: '#e0e0e0',
        fontSize: '0.9rem',
    },
    logoutBtn: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
};

export default Navbar;
