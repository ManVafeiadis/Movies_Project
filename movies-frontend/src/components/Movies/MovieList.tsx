import React, { useState, useEffect } from 'react';
import { Movie } from '../../types';
import { MovieService } from '../../services/api';
import MovieCard from './MovieCard';

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch movies when component mounts
    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await MovieService.getAll();
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to load movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter movies based on search term
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle movie deletion and update the list
    const handleMovieDelete = (deletedId: number) => {
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== deletedId));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-navy text-xl">Loading movies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-navy">Movies</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-md border border-sage 
                                 focus:outline-none focus:ring-2 focus:ring-navy
                                 bg-white text-navy placeholder-gray-400"
                    />
                </div>
            </div>

            {filteredMovies.length === 0 ? (
                <div className="text-center py-8 text-navy">
                    {searchTerm 
                        ? 'No movies found matching your search.'
                        : 'No movies available.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onDelete={handleMovieDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;
