import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <XCircle size={20} className="text-red-600" />,
    info: <AlertCircle size={20} className="text-blue-600" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 p-4 rounded-xl border-2 shadow-lg ${colors[type]} animate-slide-in max-w-sm sm:max-w-none`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="font-semibold">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          ✕
        </button>
      </div>
    </div>
  );
};