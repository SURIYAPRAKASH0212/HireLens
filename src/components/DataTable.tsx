import React from 'react';

interface DataTableProps {
  title?: string;
  description?: string;
  headers: string[];
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  headers,
  children,
  actions
}) => {
  return (
    <div className="glass dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-premium overflow-hidden">
      
      {/* Table Header Section */}
      {(title || actions) && (
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Main Table Wrapper */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/80">
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};
