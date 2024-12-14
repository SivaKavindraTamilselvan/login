import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Logout
            </button>
        </div>
    );
};

