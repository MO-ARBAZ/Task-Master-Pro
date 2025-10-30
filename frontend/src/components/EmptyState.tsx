import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-results';
  onCreateTask?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onCreateTask }) => {
  if (type === 'no-tasks') {
    return (
      <div className="text-center py-16">
        <div className="glass-card p-12 max-w-md mx-auto">
          <div className="animate-bounce mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full inline-block">
              <CheckSquare size={64} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🎆 Ready to get productive?
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your task dashboard is empty and waiting for action! Create your first task to start organizing your workflow and boost your productivity.
          </p>
          {onCreateTask && (
            <button onClick={onCreateTask} className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4">
              <Plus size={24} />
              ✨ Create Your First Task
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="glass-card p-12 max-w-md mx-auto">
        <div className="mb-6">
          <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full inline-block">
            <CheckSquare size={64} className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🔍 No matching tasks found
        </h3>
        <p className="text-gray-600 leading-relaxed">
          No tasks match your current filters. Try adjusting your search criteria or create a new task to get started.
        </p>
      </div>
    </div>
  );
};