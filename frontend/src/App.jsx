import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobListPage from './pages/JobListPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateProfile from './pages/CandidateProfile';
import CompanyProfile from './pages/CompanyProfile';
import JobForm from './pages/JobForm';
import RecruiterJobs from './pages/RecruiterJobs';
import JobApplicants from './pages/JobApplicants';
import JobDetailPage from './pages/JobDetailPage';
import LandingPage from './pages/LandingPage';

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
        // Redirect to appropriate dashboard based on user's actual role
        if (user?.role === 'candidate') {
            return <Navigate to="/candidate/dashboard" replace />;
        } else if (user?.role === 'recruiter') {
            return <Navigate to="/recruiter/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

// Dashboard Router - redirects to role-specific dashboard
const DashboardRouter = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (user?.role === 'candidate') {
        return <Navigate to="/candidate/dashboard" replace />;
    } else if (user?.role === 'recruiter') {
        return <Navigate to="/recruiter/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
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
                        <Route path="/jobs/:id" element={<JobDetailPage />} />

                        {/* Generic dashboard route - redirects based on role */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardRouter />
                                </ProtectedRoute>
                            }
                        />

                        {/* Candidate Routes */}
                        <Route
                            path="/candidate/dashboard"
                            element={
                                <ProtectedRoute requiredRole="candidate">
                                    <CandidateDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/candidate/profile"
                            element={
                                <ProtectedRoute requiredRole="candidate">
                                    <CandidateProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Recruiter Routes */}
                        <Route
                            path="/recruiter/dashboard"
                            element={
                                <ProtectedRoute requiredRole="recruiter">
                                    <RecruiterDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recruiter/company"
                            element={
                                <ProtectedRoute requiredRole="recruiter">
                                    <CompanyProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recruiter/jobs"
                            element={
                                <ProtectedRoute requiredRole="recruiter">
                                    <RecruiterJobs />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recruiter/jobs/new"
                            element={
                                <ProtectedRoute requiredRole="recruiter">
                                    <JobForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recruiter/jobs/:id/edit"
                            element={
                                <ProtectedRoute requiredRole="recruiter">
                                    <JobForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recruiter/jobs/:jobId/applicants"
                            element={
                                <ProtectedRoute requiredRole="recruiter">
                                    <JobApplicants />
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
