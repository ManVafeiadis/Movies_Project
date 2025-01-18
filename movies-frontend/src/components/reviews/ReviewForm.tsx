import React, { useState } from 'react';

interface ReviewFormProps {
    onSubmit: (reviewText: string, rating: number) => Promise<void>;
    initialRating?: number;
    initialReview?: string;
    isEdit?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    onSubmit,
    initialRating = 5,
    initialReview = '',
    isEdit = false
}) => {
    // Initialize state with either initial values or defaults
    const [review, setReview] = useState(initialReview);
    const [rating, setRating] = useState(initialRating);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (rating < 1 || rating > 10) {
            setError('Rating must be between 1 and 10');
            return;
        }
        if (!review.trim()) {
            setError('Review text is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        try {
            await onSubmit(review, rating);
            // Only clear form if it's not an edit form
            if (!isEdit) {
                setReview('');
                setRating(5);
            }
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-navy">
                {isEdit ? 'Edit Review' : 'Write a Review'}
            </h3>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md">
                    {error}
                </div>
            )}
            
            {/* Rating Input */}
            <div>
                <label className="block text-navy mb-2">
                    Rating (1-10)
                </label>
                <div className="flex items-center space-x-4">
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="flex-grow"
                        disabled={isSubmitting}
                    />
                    <span className="text-navy font-bold w-8">
                        {rating}
                    </span>
                </div>
            </div>

            {/* Review Text Input */}
            <div>
                <label className="block text-navy mb-2">
                    Your Review
                </label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full px-3 py-2 border border-sage rounded-md
                             focus:outline-none focus:ring-2 focus:ring-navy
                             disabled:opacity-50"
                    placeholder="Share your thoughts about this movie..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`
                    w-full py-2 px-4 rounded-md bg-navy text-cream
                    hover:bg-opacity-90 transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {isSubmitting 
                    ? 'Submitting...' 
                    : isEdit 
                        ? 'Update Review' 
                        : 'Submit Review'
                }
            </button>
        </form>
    );
};

export default ReviewForm;
