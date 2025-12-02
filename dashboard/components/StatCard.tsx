import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage change
  icon: React.ReactNode;
  colorClass: string;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, colorClass, subtext }) => {
  return (
    <div className="group relative overflow-hidden glass-panel rounded-xl p-5 transition-all duration-300 hover:shadow-md">
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        
        {/* Simple clean icon container */}
        <div className={`p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5` }) : icon}
        </div>
      </div>
      
      {(trend !== undefined || subtext) && (
        <div className="mt-4 flex items-center text-xs relative z-10">
          {trend !== undefined && (
            <div className="flex items-center font-bold mr-3">
              {trend > 0 ? (
                <>
                  <ArrowUpRight className="w-3 h-3 text-emerald-600 mr-1" />
                  <span className="text-emerald-700">{Math.abs(trend)}%</span>
                </>
              ) : trend < 0 ? (
                <>
                  <ArrowDownRight className="w-3 h-3 text-rose-600 mr-1" />
                  <span className="text-rose-700">{Math.abs(trend)}%</span>
                </>
              ) : (
                <>
                  <Minus className="w-3 h-3 text-slate-400 mr-1" />
                  <span className="text-slate-500">0%</span>
                </>
              )}
            </div>
          )}
          {subtext && (
             <span className="text-slate-400 font-medium ml-auto truncate max-w-[120px]">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};