import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children
}) => {
  return (
    <div className="glass dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-premium flex flex-col h-[320px]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-1 w-full h-full min-h-0 relative">
        {children}
      </div>
    </div>
  );
};
