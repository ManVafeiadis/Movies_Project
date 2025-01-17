// src/components/forms/FormInput.tsx

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    error, 
    className = '', 
    ...props 
}) => {
    // We extend the base input styles with any additional classes passed in
    const inputClasses = `
        w-full px-4 py-2 rounded-md border 
        focus:outline-none focus:ring-2 focus:ring-navy 
        bg-white text-navy placeholder-gray-400
        ${error ? 'border-red-500' : 'border-sage'} 
        ${className}
    `.trim();

    return (
        <div className="mb-4">
            <label className="block text-navy font-medium mb-2">
                {label}
            </label>
            <input 
                className={inputClasses}
                {...props} 
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
