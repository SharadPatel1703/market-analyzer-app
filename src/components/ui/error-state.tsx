import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
    message: string;
    retry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, retry }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">{message}</p>
                {retry && (
                    <button
                        onClick={retry}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorState;