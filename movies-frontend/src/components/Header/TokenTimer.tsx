import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const TokenTimer: React.FC = () => {
    const { tokenExpiry } = useAuth();
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        // Function to calculate and format remaining time
        const updateTimer = () => {
            if (!tokenExpiry) {
                setTimeLeft('');
                return;
            }

            const now = new Date();
            const expiryTime = new Date(tokenExpiry);
            const diff = expiryTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }

            // Convert milliseconds to minutes and seconds
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        };

        // Update immediately and then every second
        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [tokenExpiry]);

    if (!timeLeft) return null;

    return (
        <span className={`text-sm ${
            timeLeft === 'Expired' ? 'text-red-500' : 'text-sage'
        }`}>
            Session expires in: {timeLeft}
        </span>
    );
};

export default TokenTimer;
