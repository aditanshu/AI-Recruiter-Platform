import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user?.role === 'candidate') {
            return <Navigate to="/candidate/dashboard" replace />;
        } else if (user?.role === 'recruiter') {
            return <Navigate to="/recruiter/dashboard" replace />;
        }
    }

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <section style={styles.hero} className="fade-in">
                <h1 style={styles.title}>
                    AI-Powered Hiring Platform
                </h1>
                <p style={styles.subtitle}>
                    Connect talent with opportunities using intelligent matching algorithms
                </p>
                <div style={styles.cta}>
                    <Link to="/signup" style={styles.primaryBtn} className="btn-primary">
                        Get Started
                    </Link>
                    <Link to="/jobs" style={styles.secondaryBtn} className="btn-secondary">
                        Browse Jobs
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section style={styles.features}>
                <h2 style={styles.sectionTitle}>Why Choose Us</h2>
                <div style={styles.grid}>
                    <div style={styles.feature} className="card">
                        <div style={styles.icon}>🤖</div>
                        <h3 style={styles.featureTitle}>AI Matching</h3>
                        <p style={styles.featureText}>
                            Smart algorithms match candidates with perfect job opportunities
                        </p>
                    </div>

                    <div style={styles.feature} className="card">
                        <div style={styles.icon}>📊</div>
                        <h3 style={styles.featureTitle}>Analytics</h3>
                        <p style={styles.featureText}>
                            Real-time insights and match scores for better decisions
                        </p>
                    </div>

                    <div style={styles.feature} className="card">
                        <div style={styles.icon}>⚡</div>
                        <h3 style={styles.featureTitle}>Fast Hiring</h3>
                        <p style={styles.featureText}>
                            Streamlined process from application to interview
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={styles.stats}>
                <div style={styles.statsGrid}>
                    <div style={styles.stat}>
                        <div style={styles.statNumber}>10K+</div>
                        <div style={styles.statLabel}>Active Jobs</div>
                    </div>
                    <div style={styles.stat}>
                        <div style={styles.statNumber}>50K+</div>
                        <div style={styles.statLabel}>Candidates</div>
                    </div>
                    <div style={styles.stat}>
                        <div style={styles.statNumber}>95%</div>
                        <div style={styles.statLabel}>Success Rate</div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={styles.finalCta}>
                <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
                <p style={styles.ctaText}>Join thousands already using our platform</p>
                <Link to="/signup" style={styles.ctaButton} className="btn-primary">
                    Create Account
                </Link>
            </section>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
    },
    hero: {
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
    },
    title: {
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: '800',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
        maxWidth: '900px',
    },
    subtitle: {
        fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
        color: 'var(--text-secondary)',
        marginBottom: '3rem',
        maxWidth: '700px',
    },
    cta: {
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    primaryBtn: {
        textDecoration: 'none',
        fontSize: '1.1rem',
    },
    secondaryBtn: {
        textDecoration: 'none',
        fontSize: '1.1rem',
    },
    features: {
        padding: '6rem 2rem',
        background: 'var(--bg-secondary)',
    },
    sectionTitle: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '4rem',
        color: 'var(--text-primary)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    feature: {
        padding: '2.5rem',
        textAlign: 'center',
    },
    icon: {
        fontSize: '3.5rem',
        marginBottom: '1.5rem',
    },
    featureTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    featureText: {
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.7',
    },
    stats: {
        padding: '6rem 2rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
    },
    stat: {
        padding: '2rem',
    },
    statNumber: {
        fontSize: '3.5rem',
        fontWeight: '800',
        color: 'var(--accent-primary)',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    finalCta: {
        padding: '6rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
    },
    ctaTitle: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: '700',
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    ctaText: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        marginBottom: '2.5rem',
    },
    ctaButton: {
        textDecoration: 'none',
        fontSize: '1.1rem',
        padding: '1rem 3rem',
    },
};

export default LandingPage;
