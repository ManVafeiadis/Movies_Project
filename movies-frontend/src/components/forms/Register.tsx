import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';

interface RegisterForm {
    username: string;
    email: string;
    password: string;
    password2: string;
}

interface FormErrors {
    username?: string | string[];
    email?: string | string[];
    password?: string | string[];
    password1?: string | string[];  // Added this for Django's password1 field
    password2?: string | string[];
    non_field_errors?: string | string[];
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [formData, setFormData] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        password2: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await register(
                formData.username,
                formData.email,
                formData.password,
                formData.password2
            );
            navigate('/');
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Handle different types of error responses
            if (error.response?.data) {
                const errorData = error.response.data;
                // Map password1 errors to password field
                if (errorData.password1) {
                    errorData.password = errorData.password1;
                    delete errorData.password1;
                }
                setErrors(errorData);
            } else {
                setErrors({
                    non_field_errors: error.message || 'Registration failed'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        // Password confirmation validation
        if (!formData.password2) {
            newErrors.password2 = 'Please confirm your password';
        } else if (formData.password !== formData.password2) {
            newErrors.password2 = 'Passwords do not match';
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

    const renderErrors = (errors: string | string[] | undefined) => {
        if (!errors) return null;
        
        const errorArray = Array.isArray(errors) ? errors : [errors];
        return errorArray.map((error, index) => (
            <div key={index} className="text-sm text-red-600">
                {error}
            </div>
        ));
    };




    return (
        <div className="max-w-md mx-auto bg-cream p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-navy mb-6 text-center">
                Create an Account
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display non-field errors at the top */}
                {errors.non_field_errors && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
                        {renderErrors(errors.non_field_errors)}
                    </div>
                )}
                
                <FormInput
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="Choose a username"
                    disabled={isLoading}
                />
                
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Enter your email"
                    disabled={isLoading}
                />
                
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Choose a password"
                    disabled={isLoading}
                />
                
                <FormInput
                    label="Confirm Password"
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    error={errors.password2}
                    placeholder="Confirm your password"
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
                    {isLoading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            
            <p className="mt-4 text-center text-navy">
                Already have an account?{' '}
                <Link 
                    to="/login" 
                    className="text-gold hover:underline"
                >
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default Register;