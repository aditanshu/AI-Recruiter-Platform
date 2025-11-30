import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount and validate token
        const initAuth = async () => {
            const storedUser = authService.getStoredUser();
            const token = localStorage.getItem('access_token');

            if (storedUser && token) {
                try {
                    // Validate token by fetching current user
                    const response = await apiClient.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    // Token is invalid or expired, clear storage
                    console.error('Token validation failed:', error);
                    authService.logout();
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        signup,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isCandidate: user?.role === 'candidate',
        isRecruiter: user?.role === 'recruiter',
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
