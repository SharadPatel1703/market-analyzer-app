import * as React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    title?: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    aria-hidden="true"
                />

                <div
                    className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;