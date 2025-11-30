import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobListPage from './pages/JobListPage';
import CandidateDashboard from './pages/CandidateDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Landing Page
const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div style={styles.landing}>
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>AI-Powered Hiring Platform</h1>
                <p style={styles.heroSubtitle}>
                    Connect talent with opportunities using intelligent matching
                </p>
                <div style={styles.heroButtons}>
                    <a href="/signup" style={styles.primaryButton}>
                        Get Started
                    </a>
                    <a href="/jobs" style={styles.secondaryButton}>
                        Browse Jobs
                    </a>
                </div>
            </div>

            <div style={styles.features}>
                <div style={styles.feature}>
                    <div style={styles.featureIcon}>🤖</div>
                    <h3 style={styles.featureTitle}>AI Matching</h3>
                    <p style={styles.featureText}>
                        Smart algorithms match candidates with perfect job opportunities
                    </p>
                </div>
                <div style={styles.feature}>
                    <div style={styles.featureIcon}>📄</div>
                    <h3 style={styles.featureTitle}>Resume Parsing</h3>
                    <p style={styles.featureText}>
                        Automatic skill extraction and profile building from your resume
                    </p>
                </div>
                <div style={styles.feature}>
                    <div style={styles.featureIcon}>⚡</div>
                    <h3 style={styles.featureTitle}>Fast Hiring</h3>
                    <p style={styles.featureText}>
                        Streamlined process from application to interview scheduling
                    </p>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div style={styles.app}>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/jobs" element={<JobListPage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <CandidateDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

const styles = {
    app: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666',
    },
    landing: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    hero: {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'white',
        borderRadius: '15px',
        marginBottom: '3rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    heroTitle: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '1rem',
    },
    heroSubtitle: {
        fontSize: '1.3rem',
        color: '#666',
        marginBottom: '2rem',
    },
    heroButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '1rem 2.5rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        transition: 'transform 0.2s',
    },
    secondaryButton: {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '1rem 2.5rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    },
    feature: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    featureIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    featureTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        marginBottom: '0.5rem',
    },
    featureText: {
        color: '#666',
        lineHeight: '1.6',
    },
};

export default App;
