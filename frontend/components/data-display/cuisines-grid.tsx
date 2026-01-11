"use client";
import React, { useState } from "react";

interface CuisinesGridProps {
    title: string;
    items: string[];
}

const CuisinesGrid: React.FC<CuisinesGridProps> = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);


    const limit = 6;
    const more = items.length > limit;
    const previewItems = items.slice(0, limit);

    return (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
                {title}
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                {previewItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 rounded-lg border border-indigo-50 bg-indigo-50/30 text-slate-700">
                        <span className="font-semibold">{item}</span>
                    </li>
                ))}
            </ul>

            {more && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors group cursor-pointer"
                >
                    <span>See more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-indigo-900">{title}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-indigo-50 bg-indigo-50/30 text-slate-700">
                                        <span className="font-semibold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CuisinesGrid;