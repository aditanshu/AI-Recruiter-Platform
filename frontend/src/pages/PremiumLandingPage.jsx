import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PremiumLandingPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [scrollY, setScrollY] = useState(0);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);

        // Create particles
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 10,
        }));
        setParticles(newParticles);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isAuthenticated) {
        if (user?.role === 'candidate') {
            return <Navigate to="/candidate/dashboard" replace />;
        } else if (user?.role === 'recruiter') {
            return <Navigate to="/recruiter/dashboard" replace />;
        }
    }

    return (
        <div style={styles.container}>
            {/* Animated Particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                    }}
                />
            ))}

            {/* Hero Section */}
            <section style={{
                ...styles.hero,
                transform: `translateY(${scrollY * 0.5}px)`,
            }}>
                <div style={styles.heroContent} className="fade-in-up">
                    <h1 style={styles.heroTitle} className="gradient-text">
                        AI-Powered Hiring
                        <br />
                        <span style={styles.heroSubtext}>Reimagined</span>
                    </h1>
                    <p style={styles.heroDescription}>
                        Connect exceptional talent with extraordinary opportunities using
                        cutting-edge AI technology and intelligent matching algorithms.
                    </p>
                    <div style={styles.heroCTA}>
                        <Link to="/signup" className="glow-button" style={styles.primaryButton}>
                            Get Started Free
                        </Link>
                        <Link to="/jobs" style={styles.secondaryButton} className="glass-card">
                            Explore Jobs
                        </Link>
                    </div>
                </div>

                {/* Floating Elements */}
                <div style={styles.floatingElements}>
                    <div style={styles.floatingCard1} className="glass-card floating">
                        <div style={styles.cardIcon}>🚀</div>
                        <div style={styles.cardText}>10K+ Jobs</div>
                    </div>
                    <div style={styles.floatingCard2} className="glass-card floating">
                        <div style={styles.cardIcon}>⚡</div>
                        <div style={styles.cardText}>AI Matching</div>
                    </div>
                    <div style={styles.floatingCard3} className="glass-card floating">
                        <div style={styles.cardIcon}>🎯</div>
                        <div style={styles.cardText}>95% Success</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                ...styles.features,
                transform: `translateY(${scrollY * 0.3}px)`,
            }}>
                <h2 style={styles.sectionTitle} className="gradient-text">
                    Why Choose Us?
                </h2>
                <div style={styles.featuresGrid}>
                    <div className="glass-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>🤖</div>
                        <h3 style={styles.featureTitle}>AI-Powered Matching</h3>
                        <p style={styles.featureText}>
                            Our advanced algorithms analyze skills, experience, and culture fit
                            to connect you with perfect opportunities.
                        </p>
                        <div style={styles.featureGlow} />
                    </div>

                    <div className="glass-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>📊</div>
                        <h3 style={styles.featureTitle}>Smart Analytics</h3>
                        <p style={styles.featureText}>
                            Get real-time insights and match scores to make data-driven
                            hiring decisions faster than ever.
                        </p>
                        <div style={styles.featureGlow} />
                    </div>

                    <div className="glass-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>⚡</div>
                        <h3 style={styles.featureTitle}>Lightning Fast</h3>
                        <p style={styles.featureText}>
                            Streamlined workflows reduce time-to-hire by 60% while
                            maintaining quality and precision.
                        </p>
                        <div style={styles.featureGlow} />
                    </div>

                    <div className="glass-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>🔒</div>
                        <h3 style={styles.featureTitle}>Secure & Private</h3>
                        <p style={styles.featureText}>
                            Enterprise-grade security ensures your data is protected
                            with end-to-end encryption.
                        </p>
                        <div style={styles.featureGlow} />
                    </div>

                    <div className="glass-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>🌐</div>
                        <h3 style={styles.featureTitle}>Global Reach</h3>
                        <p style={styles.featureText}>
                            Access talent from around the world with support for
                            remote, hybrid, and on-site positions.
                        </p>
                        <div style={styles.featureGlow} />
                    </div>

                    <div className="glass-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>💎</div>
                        <h3 style={styles.featureTitle}>Premium Experience</h3>
                        <p style={styles.featureText}>
                            Enjoy a beautiful, intuitive interface designed for
                            maximum productivity and delight.
                        </p>
                        <div style={styles.featureGlow} />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={styles.stats}>
                <div style={styles.statsGrid}>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={styles.statNumber} className="gradient-text">10K+</div>
                        <div style={styles.statLabel}>Active Jobs</div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={styles.statNumber} className="gradient-text">50K+</div>
                        <div style={styles.statLabel}>Candidates</div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={styles.statNumber} className="gradient-text">95%</div>
                        <div style={styles.statLabel}>Match Rate</div>
                    </div>
                    <div className="glass-card" style={styles.statCard}>
                        <div style={styles.statNumber} className="gradient-text">24/7</div>
                        <div style={styles.statLabel}>Support</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.cta}>
                <div className="glass-card" style={styles.ctaCard}>
                    <h2 style={styles.ctaTitle} className="gradient-text">
                        Ready to Transform Your Hiring?
                    </h2>
                    <p style={styles.ctaText}>
                        Join thousands of companies and candidates already using our platform
                    </p>
                    <div style={styles.ctaButtons}>
                        <Link to="/signup" className="glow-button" style={styles.ctaPrimary}>
                            Start For Free
                        </Link>
                        <Link to="/login" style={styles.ctaSecondary} className="glass-card">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
    },
    hero: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '2rem',
        transition: 'transform 0.1s ease-out',
    },
    heroContent: {
        textAlign: 'center',
        maxWidth: '900px',
        zIndex: 2,
    },
    heroTitle: {
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: '900',
        marginBottom: '1rem',
        lineHeight: '1.1',
        letterSpacing: '-2px',
    },
    heroSubtext: {
        display: 'block',
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    },
    heroDescription: {
        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
        color: 'var(--text-secondary)',
        marginBottom: '3rem',
        lineHeight: '1.6',
        maxWidth: '700px',
        margin: '0 auto 3rem',
    },
    heroCTA: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    primaryButton: {
        padding: '1.2rem 3rem',
        fontSize: '1.1rem',
        textDecoration: 'none',
        display: 'inline-block',
    },
    secondaryButton: {
        padding: '1.2rem 3rem',
        fontSize: '1.1rem',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
    floatingElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
    floatingCard1: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        padding: '1.5rem 2rem',
        animationDelay: '0s',
    },
    floatingCard2: {
        position: 'absolute',
        top: '60%',
        right: '15%',
        padding: '1.5rem 2rem',
        animationDelay: '2s',
    },
    floatingCard3: {
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        padding: '1.5rem 2rem',
        animationDelay: '4s',
    },
    cardIcon: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
    },
    cardText: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    features: {
        padding: '8rem 2rem',
        position: 'relative',
        transition: 'transform 0.1s ease-out',
    },
    sectionTitle: {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: '4rem',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    featureCard: {
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
    },
    featureIcon: {
        fontSize: '3.5rem',
        marginBottom: '1.5rem',
        display: 'block',
    },
    featureTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    featureText: {
        fontSize: '1rem',
        lineHeight: '1.7',
        color: 'var(--text-secondary)',
    },
    featureGlow: {
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(0, 245, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    stats: {
        padding: '6rem 2rem',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    statCard: {
        padding: '3rem 2rem',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '4rem',
        fontWeight: '900',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    cta: {
        padding: '8rem 2rem',
    },
    ctaCard: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '4rem 3rem',
        textAlign: 'center',
    },
    ctaTitle: {
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        fontWeight: '900',
        marginBottom: '1.5rem',
    },
    ctaText: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        marginBottom: '3rem',
    },
    ctaButtons: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    ctaPrimary: {
        padding: '1.2rem 3rem',
        fontSize: '1.1rem',
        textDecoration: 'none',
    },
    ctaSecondary: {
        padding: '1.2rem 3rem',
        fontSize: '1.1rem',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        fontWeight: '600',
    },
};

export default PremiumLandingPage;
