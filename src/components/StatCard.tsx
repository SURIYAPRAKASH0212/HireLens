import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string; // Optional custom border/text color override
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color
}) => {
  return (
    <div 
      className="glass dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-premium hover:shadow-xl dark:hover:shadow-2xl/40 transition-all duration-300 hover:-translate-y-0.5 group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-brand-500/10 group-hover:text-brand-500 transition-colors duration-300`}>
          <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-brand-500 transition-colors" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </span>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs font-semibold
                ${changeType === 'positive' ? 'text-emerald-500' : changeType === 'negative' ? 'text-rose-500' : 'text-slate-400'}
              `}>
                {change}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                vs last month
              </span>
            </div>
          )}
        </div>

        {/* Minimal Sparkline decorative animation */}
        <div className="flex items-end gap-0.5 h-8 opacity-40 group-hover:opacity-75 transition-opacity duration-300">
          <span className="w-1 bg-brand-400/50 dark:bg-brand-500/40 rounded-t-sm h-[30%] animate-pulse" />
          <span className="w-1 bg-brand-400/50 dark:bg-brand-500/40 rounded-t-sm h-[50%]" />
          <span className="w-1 bg-brand-400/50 dark:bg-brand-500/40 rounded-t-sm h-[40%]" />
          <span className="w-1 bg-brand-400/50 dark:bg-brand-500/40 rounded-t-sm h-[75%] animate-pulse" />
          <span className="w-1 bg-brand-500 dark:bg-brand-400 rounded-t-sm h-[90%]" />
        </div>
      </div>
    </div>
  );
};
