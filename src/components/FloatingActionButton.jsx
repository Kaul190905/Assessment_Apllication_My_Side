import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, ClipboardIcon } from './Icons';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on login or test pages
    if (location.pathname === '/login' || location.pathname === '/test') {
        return null;
    }

    const actions = [
        {
            icon: <HomeIcon size={20} />,
            label: 'Dashboard',
            path: '/',
            color: 'var(--primary)'
        },
        {
            icon: <UserIcon size={20} />,
            label: 'Profile',
            path: '/profile',
            color: 'var(--success)'
        },
        {
            icon: <ClipboardIcon size={20} />,
            label: 'My Tests',
            path: '/',
            color: 'var(--warning)'
        }
    ];

    const handleAction = (action) => {
        navigate(action.path);
        setIsOpen(false);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`fab-container ${isOpen ? 'open' : ''}`}>
            {/* Action buttons */}
            <div className="fab-actions">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className="fab-action"
                        onClick={() => handleAction(action)}
                        style={{
                            '--action-color': action.color,
                            transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                        }}
                        aria-label={action.label}
                    >
                        <span className="fab-action-icon">{action.icon}</span>
                        <span className="fab-action-label">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Main FAB button */}
            <button
                className="fab-main"
                onClick={toggleOpen}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open quick actions'}
            >
                <span className="fab-icon">{isOpen ? '×' : '+'}</span>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fab-overlay" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
};

export default FloatingActionButton;
