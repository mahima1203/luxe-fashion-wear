import React, { useState, useRef, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    return (
        <input 
            ref={ref}
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#d6003c] focus:ring-1 focus:ring-[#d6003c] transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 disabled:opacity-70 disabled:bg-gray-100 disabled:cursor-pointer ${className}`}
            {...props} 
        />
    );
});
Input.displayName = 'Input';

export const CustomSelect = ({ 
    options, 
    value, 
    onChange, 
    placeholder = "Select...", 
    className = '' 
}: { 
    options: {label: string, value: string}[], 
    value: string, 
    onChange: (val: string) => void,
    placeholder?: string,
    className?: string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            <div 
                className={`w-full px-4 py-3 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all text-sm font-medium ${isOpen ? 'bg-white border-[#d6003c] ring-1 ring-[#d6003c]' : 'border-gray-200 hover:border-gray-300'} ${value ? 'text-gray-900' : 'text-gray-400'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#d6003c]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
            
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                className={`px-4 py-3 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-rose-50 text-[#d6003c] font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
    const baseStyle = "px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 disabled:opacity-50 flex items-center justify-center cursor-pointer";
    const variants = {
        primary: "bg-[#d6003c] hover:bg-[#b00030] text-white shadow-lg hover:shadow-[#d6003c]/30",
        outline: "border-2 border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 bg-white",
        danger: "border-2 border-rose-100 text-rose-600 hover:bg-rose-50 bg-white",
        ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
    };
    return (
        <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
            {children}
        </button>
    );
};
