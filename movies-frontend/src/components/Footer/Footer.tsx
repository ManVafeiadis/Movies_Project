import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    // Get the current year for the copyright notice
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy text-cream mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">About Movie Reviews</h3>
                        <p className="text-cream/80">
                            Share your thoughts on your favorite movies and discover 
                            new films through our community's reviews.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Quick Links</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link to="/" className="text-cream/80 hover:text-cream">
                                Home
                            </Link>
                            <Link to="/login" className="text-cream/80 hover:text-cream">
                                Login
                            </Link>
                            <Link to="/register" className="text-cream/80 hover:text-cream">
                                Register
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Contact</h3>
                        <div className="text-cream/80 space-y-2">
                            <p>Email: info@moviereviewer.com</p>
                        </div>
                    </div>
                </div>

                {/* Copyright Notice */}
                <div className="mt-8 pt-8 border-t border-cream/20 text-center text-cream/60">
                    <p>© {currentYear} Movie Reviews. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
