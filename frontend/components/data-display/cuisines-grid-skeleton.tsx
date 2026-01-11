"use client";
import React from "react";

interface CuisinesGridSkeletonProps {
    title?: boolean;
    itemsCount?: number;
    showButton?: boolean;
}

const CuisinesGridSkeleton: React.FC<CuisinesGridSkeletonProps> = ({
    title = true,
    itemsCount = 6,
    showButton = true,
}) => {
    return (
        <div className="mb-10 animate-pulse">
            {/* Title Skeleton */}
            {title && (
                <div className="h-8 w-52 bg-indigo-200/60 rounded mb-6 border-b-2 border-transparent"></div>
            )}

            {/* Grid Skeleton */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                {Array.from({ length: itemsCount }).map((_, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border border-indigo-100 bg-indigo-100/40"
                    >
                        <div className="h-4 w-32 bg-indigo-300/60 rounded"></div>
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

export default CuisinesGridSkeleton;
