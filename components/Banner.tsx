import React, { useState, useEffect, useRef } from 'react';

const Arrow = ({ direction, onClick }: { direction: 'left' | 'right', onClick: () => void }) => {
    const isLeft = direction === 'left';
    return (
        <button 
            onClick={onClick}
            className={`absolute top-1/2 ${isLeft ? 'left-2' : 'right-2'} -translate-y-1/2 bg-white/60 hover:bg-white/90 rounded-full p-2 transition-colors z-10`}
            aria-label={isLeft ? 'Banner anterior' : 'Próximo banner'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isLeft ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                )}
            </svg>
        </button>
    );
};


export function Banner({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () => setCurrentIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            ),
            5000 // Change slide every 5 seconds
        );
        return () => {
            resetTimeout();
        };
    }, [currentIndex, images.length]);


    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };


    return (
        <div className="w-full max-w-5xl mx-auto mt-8 relative h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
            <Arrow direction="left" onClick={goToPrevious} />
            <div 
                className="whitespace-nowrap h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${-currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                     <div key={index} className="inline-block w-full h-full">
                         <img 
                            src={src} 
                            alt={`Banner ${index + 1}`} 
                            className="w-full h-full object-cover"
                         />
                    </div>
                ))}
            </div>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                            currentIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Ir para banner ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
}