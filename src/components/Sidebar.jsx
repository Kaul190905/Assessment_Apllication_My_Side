import React from 'react';
import { NavLink } from 'react-router-dom';
import Icons from './Icons';
import useSound from '../hooks/useSound';

const Sidebar = ({ onLogout }) => {
    const { playClick } = useSound();

    // Get user initials for avatar
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userInitials = userData.name
        ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'JD';

    const navItems = [
        { path: '/', icon: <Icons.HomeIcon />, label: 'Dashboard' },
        { path: '/tests', icon: <Icons.BookIcon />, label: 'Tests' },
        { path: '/analytics', icon: <Icons.ChartIcon />, label: 'Analytics' },
    ];

    return (
        <aside className="app-sidebar">
            <div className="sidebar-logo">
                <img src="/gradeflow-logo.png" alt="Gradeflow" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => playClick()}
                        title={item.label}
                    >
                        {item.icon}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-divider" />
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `user-avatar ${isActive ? 'active' : ''}`}
                    onClick={() => playClick()}
                    title="Profile"
                >
                    {userInitials}
                </NavLink>
                <button
                    className="nav-item logout-btn"
                    onClick={() => { playClick(); onLogout(); }}
                    title="Logout"
                >
                    <Icons.LogoutIcon />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
