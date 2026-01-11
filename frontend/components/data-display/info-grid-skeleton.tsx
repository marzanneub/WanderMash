"use client";
import React from "react";

interface InfoGridSkeletonProps {
    rows?: number;
}

const InfoGridSkeleton: React.FC<InfoGridSkeletonProps> = ({ rows = 5 }) => {
    return (
        <div className="animate-pulse">
            {/* Title Skeleton */}
            <div className="h-8 w-56 bg-indigo-200/60 rounded mb-6"></div>

            {/* Rows Skeleton */}
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {/* Label */}
                        <div className="h-4 w-28 bg-gray-300 rounded"></div>

                        {/* Colon */}
                        <div className="h-4 w-2 bg-gray-300 rounded"></div>

                        {/* Value */}
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoGridSkeleton;
