import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-floating-tray" aria-live="polite">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`toast-notification-unit ${toast.type || 'success'}`}
        >
          <div className="toast-icon-wrap">
            {toast.type === 'error' ? (
              <AlertCircle size={18} className="text-rose" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald" />
            )}
          </div>
          <div className="toast-copy">
            <strong>{toast.title}</strong>
            {toast.message && <p>{toast.message}</p>}
          </div>
          <button 
            type="button" 
            className="toast-close-btn"
            onClick={() => onDismiss(toast.id)}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
