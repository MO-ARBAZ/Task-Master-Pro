import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { TaskFilters } from './components/TaskFilters';
import { EmptyState } from './components/EmptyState';

import { SkeletonCard } from './components/SkeletonCard';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import { CheckSquare, AlertCircle } from 'lucide-react';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; taskId: string; title: string} | null>(null);

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

  const handleDeleteTask = (id: string, title: string) => {
    setConfirmDialog({ isOpen: true, taskId: id, title });
  };

  const confirmDelete = async () => {
    if (confirmDialog) {
      try {
        await deleteTask(confirmDialog.taskId);
        setToast({ message: 'Task deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete task', type: 'error' });
      }
      setConfirmDialog(null);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const result = await createTask(taskData);
      setToast({ message: 'Task created successfully!', type: 'success' });
      return result;
    } catch (error) {
      setToast({ message: 'Failed to create task', type: 'error' });
      throw error;
    }
  };

  const handleUpdateTask = async (id: string, taskData: any) => {
    try {
      const result = await updateTask(id, taskData);
      setToast({ message: 'Task updated successfully!', type: 'success' });
      return result;
    } catch (error) {
      setToast({ message: 'Failed to update task', type: 'error' });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="glass-card p-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ⚡ Loading Task Master Pro...
              </h1>
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="glass-card p-4 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <CheckSquare size={32} className="text-white sm:w-10 sm:h-10" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Task Master Pro
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">
                  ✨ Transform your productivity with style
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'todo').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">⏳ To Do</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">🔄 Progress</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">✅ Done</div>
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
        <TaskForm onSubmit={handleCreateTask} />

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
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={async (id) => handleDeleteTask(id, task.title)}
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

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Task"
          message={`Are you sure you want to delete "${confirmDialog.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

export default App;