import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import { AuthContextType, User, JwtPayload, DjangoUser } from '../types';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);

    // Function to fetch user data from Django
    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/user/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            const userData: DjangoUser = await response.json();
            console.log('User data from Django:', userData);
            return userData;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Parse token and set user state
    const parseAndSetUser = async (token: string) => {
        console.log('=== parseAndSetUser called ===');
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            console.log('Token decoded:', decoded);

            // Fetch additional user data
            const userData = await fetchUserData(token);
            if (!userData) throw new Error('Failed to get user data');

            const userState: User = {
                username: userData.username,
                isAdmin: userData.is_staff,
                token: token
            };

            console.log('Setting user state to:', userState);
            setUser(userState);
            setTokenExpiry(new Date(decoded.exp * 1000));
        } catch (error) {
            console.error('Error in parseAndSetUser:', error);
            return null;
        }
    };

    // Check token on mount
    useEffect(() => {
        console.log('=== AuthProvider mounted ===');
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Found token in localStorage');
            parseAndSetUser(token);
        } else {
            console.log('No token found in localStorage');
        }
    }, []);

    const login = async (username: string, password: string) => {
        console.log('=== Login attempt ===');
        try {
            const response = await AuthService.login(username, password);
            console.log('Login response:', response.data);

            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refresh_token', refresh);

            await parseAndSetUser(access);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log('=== Logout called ===');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setTokenExpiry(null);
    };

    const register = async (
        username: string, 
        email: string, 
        password: string, 
        password2: string
    ) => {
        console.log('=== Register attempt ===');
        try {
            const registerResponse = await AuthService.register({ 
                username, 
                email, 
                password1: password, 
                password2
            });
            console.log('Registration response:', registerResponse);

            // After successful registration, log in
            await login(username, password);
        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider 
            value={{ user, login, logout, register, tokenExpiry }}
        >
            {children}
        </AuthContext.Provider>
    );
};