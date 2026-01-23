import React, { createContext, useContext, useState, useCallback } from 'react';

// Toast Context
const ToastContext = createContext(null);

// Toast types with icons
const TOAST_ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

// Individual Toast Component
const ToastItem = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, toast.duration || 4000);

        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    return (
        <div className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon">{TOAST_ICONS[toast.type]}</div>
            <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={handleClose}>×</button>
            <div className="toast-progress" style={{ animationDuration: `${toast.duration || 4000}ms` }} />
        </div>
    );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, title = null, duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message, title, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = {
        success: (message, title) => addToast('success', message, title),
        error: (message, title) => addToast('error', message, title),
        warning: (message, title) => addToast('warning', message, title),
        info: (message, title) => addToast('info', message, title)
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Custom hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
