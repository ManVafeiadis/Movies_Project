// src/components/forms/FormInput.tsx

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string | string[];
}

const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    error, 
    className = '', 
    ...props 
}) => {
    const renderErrors = (error: string | string[] | undefined) => {
        if (!error) return null;
        const errors = Array.isArray(error) ? error : [error];
        return (
            <div className="mt-1 text-sm text-red-500">
                {errors.map((err, index) => (
                    <div key={index}>{err}</div>
                ))}
            </div>
        );
    };

    return (
        <div className="mb-4">
            <label className="block text-navy font-medium mb-2">
                {label}
            </label>
            <input 
                className={`
                    w-full px-4 py-2 rounded-md border 
                    focus:outline-none focus:ring-2 focus:ring-navy 
                    bg-white text-navy placeholder-gray-400
                    ${error ? 'border-red-500' : 'border-sage'} 
                    ${className}
                `.trim()}
                {...props} 
            />
            {renderErrors(error)}
        </div>
    );
};

export default FormInput;