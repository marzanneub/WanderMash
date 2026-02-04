import React from 'react';

const PieChartSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-6 animate-pulse">
        <div className="relative w-48 h-48">
            <div className="w-full h-full rounded-full border-[16px] border-slate-100"></div>
            
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full w-[70%] h-[70%] m-auto shadow-sm">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-12 bg-slate-200 rounded-md"></div>
                <div className="h-2 w-16 bg-slate-100 rounded-md"></div>
            </div>
            </div>
        </div>

        <div className="flex gap-8 mt-8">
            <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div className="flex flex-col gap-2">
                <div className="h-2 w-16 bg-slate-100 rounded-md"></div>
                <div className="h-5 w-10 bg-slate-200 rounded-md"></div>
            </div>
            </div>
            
            <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div className="flex flex-col gap-2">
                <div className="h-2 w-16 bg-slate-100 rounded-md"></div>
                <div className="h-5 w-10 bg-slate-200 rounded-md"></div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default PieChartSkeleton;