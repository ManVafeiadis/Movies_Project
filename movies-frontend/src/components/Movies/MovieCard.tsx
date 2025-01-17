import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MovieService } from '../../services/api';

interface MovieCardProps {
    movie: Movie;
    onDelete: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Format the release date to a more readable format
    const formattedDate = new Date(movie.release_date).toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calculate the average rating
    const averageRating = movie.reviews.length > 0
        ? (movie.reviews.reduce((acc, review) => acc + review.rating, 0) / movie.reviews.length).toFixed(1)
        : 'No ratings';

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            setIsDeleting(true);
            try {
                await MovieService.delete(movie.id);
                onDelete(movie.id);
            } catch (error) {
                console.error('Error deleting movie:', error);
                alert('Failed to delete movie');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="bg-cream border border-sage rounded-lg shadow-md overflow-hidden transition-all duration-300">
            <div 
                className={`p-4 cursor-pointer ${isExpanded ? 'bg-sage bg-opacity-20' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-navy">{movie.title}</h3>
                        <p className="text-sm text-navy opacity-75">
                            Directed by {movie.director}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block bg-navy text-cream px-3 py-1 rounded-full text-sm">
                            Rating: {averageRating}
                        </span>
                    </div>
                </div>
            </div>

            {/* Expandable content */}
            <div 
                className={`
                    transition-all duration-300 overflow-hidden
                    ${isExpanded ? 'max-h-96' : 'max-h-0'}
                `}
            >
                <div className="p-4 border-t border-sage">
                    <p className="text-navy mb-2">{movie.description}</p>
                    <p className="text-sm text-navy opacity-75 mb-4">
                        Released: {formattedDate}
                    </p>
                    <p className="text-sm text-navy opacity-75 mb-4">
                        Category: {movie.category}
                    </p>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/movie/${movie.id}`);
                            }}
                            className="bg-navy text-cream px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200"
                        >
                            See Details
                        </button>
                        {user?.isAdmin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                disabled={isDeleting}
                                className={`
                                    bg-red-500 text-white px-4 py-2 rounded-md 
                                    hover:bg-red-600 transition-colors duration-200
                                    ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
