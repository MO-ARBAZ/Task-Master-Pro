import React, { useState } from 'react';
import { CreateTaskData, Task } from '../types/Task';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: CreateTaskData) => Promise<Task>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate || undefined
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: ''
      });
      setIsOpen(false);
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to create task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
        >
          <Plus size={24} />
          ✨ Create New Task
        </button>
      </div>
    );
  }

  return (
    <div className="card mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Task
          </h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          aria-label="Close form"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            🏷️ Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`input-field text-lg font-semibold ${
              errors.title ? 'border-red-300 ring-red-500' : ''
            }`}
            placeholder="What needs to be done?"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              ⚠️ {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field resize-none"
            placeholder="Add more details about this task..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              📋 Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="input-field"
            >
              <option value="todo">⏳ To Do</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
              🎨 Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="input-field"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`input-field ${
                errors.dueDate ? 'border-red-300 ring-red-500' : ''
              }`}
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                ⚠️ {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm text-red-600 flex items-center gap-2">
              ❌ {errors.submit}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '⏳ Creating...' : '✨ Create Task'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn-secondary px-8"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};