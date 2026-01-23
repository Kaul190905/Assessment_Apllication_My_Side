import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, ChartIcon, SettingsIcon, LogoutIcon } from './Icons';

const MobileSidebar = ({ isOpen, onClose, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <HomeIcon size={20} />, label: 'Dashboard', path: '/' },
        { icon: <UserIcon size={20} />, label: 'Profile', path: '/profile' },
        { icon: <ChartIcon size={20} />, label: 'My Performance', path: '/profile' },
        { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/profile' }
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        onClose();
        onLogout();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <img src="/logo.jpg" alt="Logo" className="sidebar-logo" />
                        <span>Gradeflow</span>
                    </div>
                    <button className="sidebar-close" onClick={onClose}>×</button>
                </div>

                <div className="sidebar-user">
                    <img src="https://via.placeholder.com/50" alt="User" className="sidebar-avatar" />
                    <div className="sidebar-user-info">
                        <span className="sidebar-username">John Doe</span>
                        <span className="sidebar-role">Student</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => handleNavigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <span className="nav-icon"><LogoutIcon size={20} /></span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// Hamburger Menu Button
export const HamburgerButton = ({ onClick }) => {
    return (
        <button className="hamburger-btn" onClick={onClick} aria-label="Open menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
        </button>
    );
};

export default MobileSidebar;
