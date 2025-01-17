// src/components/reviews/ReviewItem.tsx

import React, { useState } from 'react';
import { Review } from '../../types';
import ReviewForm from './ReviewForm';

interface ReviewItemProps {
    review: Review;
    onUpdate?: (id: number, reviewText: string, rating: number) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
    canModify: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
    review,
    onUpdate,
    onDelete,
    canModify
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Format the creation date
    const formattedDate = new Date(review.created_at).toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Format the update date if it exists and is different from created_at
    const hasBeenUpdated = review.updated_at !== review.created_at;
    const formattedUpdateDate = hasBeenUpdated 
        ? new Date(review.updated_at).toLocaleDateString('en-UK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : null;

    // Handle the update submission
    const handleUpdate = async (reviewText: string, rating: number) => {
        if (onUpdate) {
            await onUpdate(review.id, reviewText, rating);
            setIsEditing(false);
        }
    };

    // Handle deletion with confirmation
    const handleDelete = async () => {
        if (!onDelete || isDeleting) return;

        if (window.confirm('Are you sure you want to delete this review?')) {
            setIsDeleting(true);
            try {
                await onDelete(review.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // If in edit mode, show the edit form
    if (isEditing) {
        return (
            <div className="border border-sage rounded-lg overflow-hidden">
                <ReviewForm
                    onSubmit={handleUpdate}
                    initialRating={review.rating}
                    initialReview={review.review || ''}
                    isEdit={true}
                />
                <div className="p-4 bg-gray-50 border-t border-sage">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-navy hover:text-opacity-80"
                    >
                        Cancel Editing
                    </button>
                </div>
            </div>
        );
    }

    // Normal display mode
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            {/* Header with author and rating */}
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-bold text-navy">
                        {review.review_author}
                    </span>
                    <span className="text-sm text-navy/60 ml-2">
                        {formattedDate}
                    </span>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-navy text-cream">
                    {review.rating}/10
                </span>
            </div>

            {/* Review content */}
            <p className="text-navy whitespace-pre-line">
                {review.review}
            </p>

            {/* Show update timestamp if the review has been edited */}
            {hasBeenUpdated && (
                <p className="text-sm text-navy/60 italic">
                    Last edited: {formattedUpdateDate}
                </p>
            )}

            {/* Action buttons for authorized users */}
            {canModify && (
                <div className="flex justify-end space-x-4 pt-2">
                    {onUpdate && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-navy hover:text-opacity-80 text-sm"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`
                                text-red-500 hover:text-red-700 text-sm
                                ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
