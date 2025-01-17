import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';

interface LoginForm {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    general?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Validates the form fields and returns true if valid
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 5) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (error) {
            setErrors({
                general: 'Invalid username or password'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-cream p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-navy mb-6 text-center">
                Login to Movie Reviews
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
                        {errors.general}
                    </div>
                )}
                
                <FormInput
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="Enter your username"
                    disabled={isLoading}
                />
                
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Enter your password"
                    disabled={isLoading}
                />
                
                <button
                    type="submit"
                    className={`
                        w-full py-2 px-4 rounded-md text-cream bg-navy
                        hover:bg-opacity-90 transition-colors duration-200
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <p className="mt-4 text-center text-navy">
                Don't have an account?{' '}
                <Link 
                    to="/register" 
                    className="text-gold hover:underline"
                >
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default Login;
