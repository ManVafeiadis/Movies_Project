// src/components/movies/MovieDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie, Review } from '../../types';
import { MovieService, ReviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ReviewForm component for creating new reviews
const ReviewForm: React.FC<{
    onSubmit: (review: string, rating: number) => Promise<void>;
}> = ({ onSubmit }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(review, rating);
            setReview('');
            setRating(5);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-navy">Write a Review</h3>
            
            <div>
                <label className="block text-navy mb-2">Rating (1-10)</label>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-sage rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-navy mb-2">Your Review</label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-3 py-2 border border-sage rounded-md h-32"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`
                    bg-navy text-cream px-6 py-2 rounded-md
                    hover:bg-opacity-90 transition-colors duration-200
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

// Single review component
const ReviewItem: React.FC<{
    review: Review;
    onDelete: (id: number) => Promise<void>;
    canDelete: boolean;
}> = ({ review, onDelete, canDelete }) => {
    const formattedDate = new Date(review.created_at).toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="font-bold text-navy">{review.review_author}</span>
                    <span className="text-sm text-navy opacity-75 ml-2">
                        {formattedDate}
                    </span>
                </div>
                <span className="bg-navy text-cream px-3 py-1 rounded-full">
                    Rating: {review.rating}/10
                </span>
            </div>
            <p className="text-navy">{review.review}</p>
            {canDelete && (
                <button
                    onClick={() => onDelete(review.id)}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                    Delete Review
                </button>
            )}
        </div>
    );
};

// Main MovieDetail component
const MovieDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch movie data
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                const response = await MovieService.getOne(Number(id));
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie:', error);
                setError('Failed to load movie details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    // Handle review submission
    const handleReviewSubmit = async (reviewText: string, rating: number) => {
        if (!movie || !user) return;
        
        try {
            const response = await ReviewService.create(movie.id, {
                review: reviewText,
                rating
            });
            
            // Update the movie state with the new review
            setMovie(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    reviews: [...prev.reviews, response.data]
                };
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    // Handle review deletion
    const handleReviewDelete = async (reviewId: number) => {
        if (!movie) return;

        try {
            await ReviewService.delete(reviewId);
            setMovie(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    reviews: prev.reviews.filter(review => review.id !== reviewId)
                };
            });
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-navy text-xl">Loading movie details...</div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
                {error || 'Movie not found'}
            </div>
        );
    }

    // Calculate average rating
    const averageRating = movie.reviews.length > 0
        ? (movie.reviews.reduce((acc, review) => acc + review.rating, 0) / movie.reviews.length).toFixed(1)
        : 'No ratings';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Movie Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-navy">{movie.title}</h1>
                    <span className="bg-navy text-cream px-4 py-2 rounded-full">
                        Rating: {averageRating}
                    </span>
                </div>
                
                <div className="space-y-4">
                    <p className="text-navy">
                        <span className="font-semibold">Director:</span> {movie.director}
                    </p>
                    <p className="text-navy">
                        <span className="font-semibold">Category:</span> {movie.category}
                    </p>
                    <p className="text-navy">
                        <span className="font-semibold">Release Date:</span>{' '}
                        {new Date(movie.release_date).toLocaleDateString('en-UK')}
                    </p>
                    <p className="text-navy">{movie.description}</p>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy">Reviews</h2>
                
                {/* Review Form */}
                {user && !movie.reviews.some(r => r.review_author === user.username) && (
                    <ReviewForm onSubmit={handleReviewSubmit} />
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {movie.reviews.length === 0 ? (
                        <p className="text-navy opacity-75">No reviews yet.</p>
                    ) : (
                        movie.reviews.map(review => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                onDelete={handleReviewDelete}
                                canDelete={
                                    user?.isAdmin || 
                                    user?.username === review.review_author
                                }
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
