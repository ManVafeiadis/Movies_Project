import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TokenTimer from './TokenTimer';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handler for the hamburger menu in mobile view
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Base classes for buttons
    const buttonClasses = "px-4 py-2 rounded-md transition-colors duration-200";
    const primaryButton = `${buttonClasses} bg-navy text-cream hover:bg-opacity-90`;
    const secondaryButton = `${buttonClasses} border-2 border-navy text-navy hover:bg-navy hover:text-cream`;

    return (
        <header className="bg-cream shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Home Link */}
                    <Link to="/" className="flex items-center">
                        <h1 className="text-2xl font-bold text-navy">MovieReviews</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-navy">Hello, {user.username}</span>
                                <TokenTimer />
                                {user.isAdmin && (
                                    <Link 
                                        to="/create-movie"
                                        className={secondaryButton}
                                    >
                                        Create New Movie
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className={primaryButton}
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={secondaryButton}>
                                    Login
                                </Link>
                                <Link to="/register" className={primaryButton}>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-navy hover:bg-sage"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-3">
                            {user ? (
                                <>
                                    <span className="text-navy">Hello, {user.username}</span>
                                    <TokenTimer />
                                    {user.isAdmin && (
                                        <Link 
                                            to="/create-movie"
                                            className={`${secondaryButton} text-center`}
                                        >
                                            Create New Movie
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className={`${primaryButton} w-full`}
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className={`${secondaryButton} text-center`}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className={`${primaryButton} text-center`}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
