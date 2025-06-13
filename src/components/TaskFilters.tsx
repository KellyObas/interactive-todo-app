import React from 'react';
import { Search, Filter, ArrowUpDown, Download } from 'lucide-react';
import { SortOption, FilterOption } from '../types/Task';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onExport: () => void;
  taskCount: number;
  completedCount: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  onExport,
  taskCount,
  completedCount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => onFilterChange(e.target.value as FilterOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high-priority">High Priority</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="category">Category</option>
            </select>
          </div>

          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{taskCount}</span> tasks
        </div>
        <div className="text-sm text-gray-600">
          Completed: <span className="font-semibold text-green-600">{completedCount}</span>
        </div>
        {taskCount > 0 && (
          <div className="text-sm text-gray-600">
            Progress: <span className="font-semibold text-indigo-600">
              {Math.round((completedCount / taskCount) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};