import React from 'react';

interface PieChartProps {
  bookings: any[];
}

const PieChart: React.FC<PieChartProps> = ({ bookings }) => {
  // 1. Data
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const total = confirmedCount + cancelledCount;

  // 2. Calculations
  const confirmedPercent = total > 0 ? Math.round((confirmedCount / total) * 100) : 0;
  const cancelledPercent = total > 0 ? 100 - confirmedPercent : 0;

  // 3. SVG Math: Circumference of a circle with radius 8 is ~50.26
  // We use radius 8 and stroke 16 to fill the 32x32 viewbox perfectly.
  const radius = 8;
  const circumference = 2 * Math.PI * radius; 
  const strokeOffset = circumference - (confirmedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 font-sans">
      <div className="relative w-48 h-48">
        {/* SVG Pie Chart */}
        <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90 drop-shadow-sm">
          {/* Background Circle (Cancelled - Rose) */}
          <circle
            r={radius}
            cx="16"
            cy="16"
            fill="transparent"
            stroke="#fee2e2" /* rose-100 */
            strokeWidth="16"
          />
          
          {/* Foreground Progress (Confirmed - Emerald) */}
          <circle
            r={radius}
            cx="16"
            cy="16"
            fill="transparent"
            stroke="#10b981" /* emerald-500 */
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Hole (To make it a Donut) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full w-[70%] h-[70%] m-auto shadow-sm">
          <span className="text-3xl font-black text-slate-800 leading-none">{total}</span>
          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">Total Bookings</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-8 mt-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Confirmed</span>
            <span className="text-xl font-extrabold text-slate-800 leading-none">{confirmedPercent}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-200 shadow-sm shadow-rose-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Cancelled</span>
            <span className="text-xl font-extrabold text-slate-800 leading-none">{cancelledPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;