import React from "react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="space-y-6 animate-pulse"
    >
      <span className="sr-only">Loading live air quality data and recommendations...</span>

      {/* Hero Skeleton */}
      <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 w-full" />

      {/* Advisory Skeleton */}
      <div className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800 w-full" />

      {/* Guidance Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};
