import React from 'react';
import { Filter } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  sortBy: string;
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  onSortChange: (sort: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  priorityFilter,
  sortBy,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortChange
}) => {
  return (
    <div className="glass-card p-6 mb-8 border-2 border-white/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
          <Filter size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🎛️ Filters & Sort
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-semibold text-gray-700 mb-2">
            📋 Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="input-field"
          >
            <option value="">🌍 All Statuses</option>
            <option value="todo">⏳ To Do</option>
            <option value="in-progress">🔄 In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority-filter" className="block text-sm font-semibold text-gray-700 mb-2">
            🎨 Filter by Priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="input-field"
          >
            <option value="">🌈 All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" className="block text-sm font-semibold text-gray-700 mb-2">
            🔄 Sort Tasks By
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-field"
          >
            <option value="createdAt">📅 Created Date</option>
            <option value="dueDate">⏰ Due Date</option>
            <option value="priority">🎨 Priority Level</option>
            <option value="status">📋 Status</option>
          </select>
        </div>
      </div>
    </div>
  );
};