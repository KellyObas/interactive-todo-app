import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
        <span className="text-2xl font-bold text-indigo-600">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>{completed} completed</span>
        <span>{total - completed} remaining</span>
      </div>
    </div>
  );
};