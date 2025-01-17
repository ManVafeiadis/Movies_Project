// src/components/reviews/ReviewsList.tsx

import React, { useState } from 'react';
import { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
    movieId: number;
    reviews: Review[];
    onAddReview: (reviewText: string, rating: number) => Promise<void>;
    onUpdateReview: (id: number, reviewText: string, rating: number) => Promise<void>;
    onDeleteReview: (id: number) => Promise<void>;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
    movieId,
    reviews,
    onAddReview,
    onUpdateReview,
    onDeleteReview
}) => {
    const { user } = useAuth();
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Check if the current user has already reviewed
    const hasUserReviewed = user && reviews.some(
        review => review.review_author === user.username
    );

    // Sort reviews based on current sort settings
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'date') {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else {
            return sortOrder === 'desc' 
                ? b.rating - a.rating 
                : a.rating - b.rating;
        }
    });

    // Calculate average rating and number of reviews
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
            .toFixed(1)
        : 'No ratings';

    // Toggle sort order
    const toggleSort = (newSortBy: 'date' | 'rating') => {
        if (sortBy === newSortBy) {
            setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    return (
        <div className="space-y-6">
            {/* Reviews Header with Stats */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-navy">
                    Reviews ({reviews.length})
                </h2>
                <div className="text-navy">
                    Average Rating: {averageRating}
                    {typeof averageRating === 'string' ? '' : '/10'}
                </div>
            </div>

            {/* Add Review Section */}
            {user && !hasUserReviewed && (
                <div className="mb-8">
                    <ReviewForm onSubmit={onAddReview} />
                </div>
            )}

            {/* Sorting Controls */}
            <div className="flex justify-end space-x-4 mb-4">
                <button
                    onClick={() => toggleSort('date')}
                    className={`px-3 py-1 rounded-md transition-colors duration-200
                        ${sortBy === 'date' 
                            ? 'bg-navy text-cream' 
                            : 'bg-cream text-navy border border-navy'}`}
                >
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                    onClick={() => toggleSort('rating')}
                    className={`px-3 py-1 rounded-md transition-colors duration-200
                        ${sortBy === 'rating' 
                            ? 'bg-navy text-cream' 
                            : 'bg-cream text-navy border border-navy'}`}
                >
                    Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-center text-navy opacity-75 py-8">
                        No reviews yet. Be the first to review this movie!
                    </p>
                ) : (
                    sortedReviews.map(review => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            onUpdate={onUpdateReview}
                            onDelete={onDeleteReview}
                            canModify={
                                user?.isAdmin || 
                                user?.username === review.review_author
                            }
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsList;
