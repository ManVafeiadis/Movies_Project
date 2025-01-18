import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MovieService } from '../../services/api';
import { Movie } from '../../types';
import FormInput from '../forms/FormInput';

interface MovieForm {
    title: string;
    director: string;
    category: string;
    description: string;
    release_date: string;
}

interface FormErrors {
    [key: string]: string;
}

const MovieEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<MovieForm>({
        title: '',
        director: '',
        category: '',
        description: '',
        release_date: '',
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch movie data when component mounts
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await MovieService.getOne(Number(id));
                const movie = response.data;
                setFormData({
                    title: movie.title,
                    director: movie.director,
                    category: movie.category,
                    description: movie.description,
                    release_date: movie.release_date,
                });
            } catch (error) {
                console.error('Error fetching movie:', error);
                setErrors({ submit: 'Failed to load movie data' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    // Validate all form fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

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

    // Handle form field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
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
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await MovieService.update(Number(id), formData);
            navigate(`/movie/${id}`);
        } catch (error) {
            console.error('Error updating movie:', error);
            setErrors({ submit: 'Failed to update movie. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading movie data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-navy mb-8">Edit Movie</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                {errors.submit && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        {errors.submit}
                    </div>
                )}

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

                <FormInput
                    label="Release Date"
                    type="date"
                    name="release_date"
                    value={formData.release_date}
                    onChange={handleChange}
                    error={errors.release_date}
                    disabled={isSubmitting}
                />

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/movie/${id}`)}
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
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MovieEdit;