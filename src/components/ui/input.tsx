import React from 'react';

type InputProps = {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    className?: string;
};

const Input: React.FC<InputProps> = ({
                                         type = 'text',
                                         placeholder = '',
                                         value,
                                         onChange,
                                         className = '',
                                     }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
    );
};

export { Input };
