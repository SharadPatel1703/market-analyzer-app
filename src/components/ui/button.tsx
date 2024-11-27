import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
};

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           variant = 'primary',
                                           className = '',
                                       }) => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };
