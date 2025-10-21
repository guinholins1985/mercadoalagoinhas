import React from 'react';

export function ShieldCheckIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.09l-.442 9.27A1 1 0 002.72 15.44l7.28-4.247a1 1 0 011 0l7.28 4.247a1 1 0 001.442-1.082l-.442-9.27A11.954 11.954 0 0110 1.944zM9 13.01l-3-3a1 1 0 011.414-1.414l2.293 2.293 4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
    );
}
