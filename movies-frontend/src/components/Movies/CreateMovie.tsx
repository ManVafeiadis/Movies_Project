// src/components/movies/CreateMovie.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieService } from '../../services/api';
import FormInput from '../forms/FormInput';

// Define the shape of our form data
interface MovieForm {
    title: string;
    director: string;
    category: string;
    description: string;
    release_date: string;
}

// Define the shape of our form errors
interface FormErrors {
    [key: string]: string;
}

const CreateMovie: React.FC = () => {
    const navigate = useNavigate();
    
    // Initialize form state with empty values except release_date
    const [formData, setFormData] = useState<MovieForm>({
        title: '',
        director: '',
        category: '',
        description: '',
        release_date: new Date().toISOString().split('T')[0] // Today's date as default
    });
    
    // State for form validation errors and submission status
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate all form fields before submission
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Check each required field and add error messages if empty
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.director.trim()) {
            newErrors.director = 'Director is required';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.release_date) {
            newErrors.release_date = 'Release date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle changes for both input fields and textarea
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error message when user starts typing in a field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Return early if validation fails
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await MovieService.create(formData);
            // Redirect to the newly created movie's detail page
            navigate(`/movie/${response.data.id}`);
        } catch (error) {
            console.error('Error creating movie:', error);
            setErrors({ submit: 'Failed to create movie. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-navy mb-8">Create New Movie</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                {/* Display submission error if any */}
                {errors.submit && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        {errors.submit}
                    </div>
                )}

                {/* Movie Title Input */}
                <FormInput
                    label="Title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    disabled={isSubmitting}
                    placeholder="Enter movie title"
                />

                {/* Director Input */}
                <FormInput
                    label="Director"
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    error={errors.director}
                    disabled={isSubmitting}
                    placeholder="Enter director's name"
                />

                {/* Category Input */}
                <FormInput
                    label="Category"
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    error={errors.category}
                    disabled={isSubmitting}
                    placeholder="Enter movie category"
                />

                {/* Description Textarea */}
                <div className="mb-4">
                    <label className="block text-navy font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Enter movie description"
                        className={`
                            w-full px-4 py-2 rounded-md border
                            focus:outline-none focus:ring-2 focus:ring-navy
                            ${errors.description ? 'border-red-500' : 'border-sage'}
                        `}
                        rows={4}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Release Date Input */}
                <FormInput
                    label="Release Date"
                    type="date"
                    name="release_date"
                    value={formData.release_date}
                    onChange={handleChange}
                    error={errors.release_date}
                    disabled={isSubmitting}
                />

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-md border-2 border-navy text-navy
                                 hover:bg-navy hover:text-cream transition-colors duration-200"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            px-6 py-2 rounded-md bg-navy text-cream
                            hover:bg-opacity-90 transition-colors duration-200
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Movie'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateMovie;
