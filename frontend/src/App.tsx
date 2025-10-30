import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { TaskFilters } from './components/TaskFilters';
import { EmptyState } from './components/EmptyState';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Task } from './types/Task';
import { CheckSquare, AlertCircle } from 'lucide-react';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filters
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { todo: 1, 'in-progress': 2, completed: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tasks, statusFilter, priorityFilter, sortBy]);

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <CheckSquare size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Task Master Pro
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  ✨ Transform your productivity with style
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'todo').length}
                </div>
                <div className="text-sm text-gray-600">⏳ To Do</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-amber-600">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">🔄 In Progress</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">✅ Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl flex items-center gap-3 shadow-lg">
            <AlertCircle size={24} className="text-red-600" />
            <span className="text-red-700 font-semibold">❌ {error}</span>
          </div>
        )}

        {/* Task Form */}
        <TaskForm onSubmit={createTask} />

        {/* Filters - Only show if there are tasks */}
        {tasks.length > 0 && (
          <TaskFilters
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            sortBy={sortBy}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onSortChange={setSortBy}
          />
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <EmptyState type="no-tasks" />
        ) : filteredAndSortedTasks.length === 0 ? (
          <EmptyState type="no-results" />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={updateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        {/* Task Summary */}
        {tasks.length > 0 && (
          <div className="mt-12 text-center">
            <div className="glass-card p-6 inline-block">
              <p className="text-lg font-semibold text-gray-700">
                📊 Showing <span className="text-blue-600">{filteredAndSortedTasks.length}</span> of <span className="text-purple-600">{tasks.length}</span> tasks
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;