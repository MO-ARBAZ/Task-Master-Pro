import React, { useState } from 'react';
import { Task } from '../types/Task';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, data: Partial<Task>) => Promise<Task>;
  onDelete: (id: string) => Promise<void>;
}

const priorityColors = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  high: 'bg-rose-100 text-rose-700 border-rose-300'
};

const statusColors = {
  todo: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700'
};

const statusIcons = {
  todo: '⏳',
  'in-progress': '🔄',
  completed: '✅'
};

const priorityIcons = {
  low: '🟢',
  medium: '🟡',
  high: '🔴'
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
  });

  const handleSave = async () => {
    try {
      await onUpdate(task._id, {
        ...editData,
        dueDate: editData.dueDate || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    await onUpdate(task._id, { status: newStatus });
  };

  if (isEditing) {
    return (
      <div className="card animate-pulse">
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="input-field text-lg font-semibold"
              placeholder="Task title"
            />
          </div>
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="input-field resize-none"
            placeholder="Add description..."
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value as Task['status'] })}
              className="input-field"
            >
              <option value="todo">⏳ To Do</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value as Task['priority'] })}
              className="input-field"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary flex-1">
              ✨ Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary">
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{statusIcons[task.status]}</span>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            aria-label="Edit task"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            aria-label="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <span className={`status-badge ${statusColors[task.status]} shadow-sm`}>
          {statusIcons[task.status]} {task.status.replace('-', ' ')}
        </span>
        <span className={`priority-badge ${priorityColors[task.priority]} shadow-sm`}>
          {priorityIcons[task.priority]} {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-xl">
          <Calendar size={16} className="text-blue-500" />
          <span className="font-medium">
            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
        <Clock size={14} />
        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-3">
        {task.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange(task.status === 'todo' ? 'in-progress' : 'completed')}
            className="btn-primary flex-1 text-sm"
          >
            {task.status === 'todo' ? '🚀 Start Task' : '✅ Mark Complete'}
          </button>
        )}
        {task.status === 'completed' && (
          <div className="flex-1 text-center py-3 bg-green-50 text-green-700 rounded-xl font-semibold">
            ✨ Task Completed!
          </div>
        )}
      </div>
    </div>
  );
};