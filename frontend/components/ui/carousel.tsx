"use client";
import { useState, useEffect } from "react"; // 1. Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CarouselProps {
    items: string[];
}

const Carousel: React.FC<CarouselProps> = ({items}) => {
    console.log(items);
    const images = items;

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // 2. Added Auto-play Logic
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); // Changes every 5 seconds

        // Cleanup the timer when the component unmounts
        return () => clearInterval(timer);
    }, [currentIndex]); // Restarts timer whenever index changes

    return (
        <div className="relative w-full h-56 sm:h-90 xl:h-100 2xl:h-120 overflow-hidden rounded-2xl shadow-lg group">
            {/* Images */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={`http://localhost:4000/images/${images[currentIndex]}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-all"
            >
                <FaChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-all"
            >
                <FaChevronRight size={24} />
            </button>
        </div>
    );
}

export default Carousel;