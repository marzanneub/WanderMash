import React from "react";

const AttractionCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-56 bg-gray-300 rounded-t-xl"></div>

            <div className="p-6 h-[150px] flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
};

export default AttractionCardSkeleton;
