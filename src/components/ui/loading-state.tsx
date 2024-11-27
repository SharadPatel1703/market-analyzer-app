import React from 'react';
import { Loader } from 'lucide-react';

export interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default LoadingState;