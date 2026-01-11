"use client";
import React from "react";

interface ServicesGridSkeletonProps {
    rows?: number;
    showButton?: boolean;
}

const ServicesGridSkeleton: React.FC<ServicesGridSkeletonProps> = ({
    rows = 6,
    showButton = true,
}) => {
    return (
        <div className="mb-10 animate-pulse">
            {/* Title Skeleton */}
            <div className="h-8 w-56 bg-indigo-200/60 rounded mb-6"></div>

            {/* Services List Skeleton */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {Array.from({ length: rows }).map((_, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {/* Icon */}
                        <div className="w-4 h-4 rounded-full bg-indigo-300/70 flex-shrink-0"></div>

                        {/* Text */}
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </li>
                ))}
            </ul>

            {/* See More Button Skeleton */}
            {showButton && (
                <div className="mt-6 flex items-center gap-2">
                    <div className="h-4 w-20 bg-indigo-300/60 rounded"></div>
                    <div className="h-4 w-4 bg-indigo-300/60 rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default ServicesGridSkeleton;
