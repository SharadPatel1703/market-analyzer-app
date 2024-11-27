"use client";
import * as React from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastProps {
    title: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (toast: ToastProps) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = (toast: ToastProps) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, ...toast }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex flex-col p-4 rounded-lg shadow-lg ${
                            toast.type === 'success' ? 'bg-green-500' :
                                toast.type === 'error' ? 'bg-red-500' :
                                    toast.type === 'warning' ? 'bg-yellow-500' :
                                        'bg-blue-500'
                        } text-white min-w-[300px]`}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">{toast.title}</h4>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-3 hover:opacity-75"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="mt-1 text-sm">{toast.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};