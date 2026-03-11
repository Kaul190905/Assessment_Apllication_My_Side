import React from 'react';
import { NavLink } from 'react-router-dom';
import Icons from './Icons';
import useSound from '../hooks/useSound';

const Sidebar = ({ onLogout }) => {
    const { playClick } = useSound();

    // Get user data for profile
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = userData.name || 'John Doe';
    const userRole = userData.role || 'Student';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    const navItems = [
        { path: '/', icon: <Icons.HomeIcon />, label: 'Dashboard' },
        { path: '/tests', icon: <Icons.BookIcon />, label: 'Assessments' },
        { path: '/analytics', icon: <Icons.ChartIcon />, label: 'Analytics' },
    ];

    return (
        <aside className="app-sidebar">
            <div className="sidebar-logo">
                <img src="/gradeflow-logo.png" alt="Gradeflow" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '-0.02em' }}>GradeFlow</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => playClick()}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `user-profile-section ${isActive ? 'active' : ''}`}
                    onClick={() => playClick()}
                    style={{ textDecoration: 'none' }}
                >
                    <div className="user-avatar">
                        {userInitials}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{userName}</span>
                        <span className="user-role">{userRole}</span>
                    </div>
                </NavLink>

                <button
                    className="nav-item logout-btn"
                    onClick={() => { playClick(); onLogout(); }}
                    style={{ border: 'none', background: 'none', width: '100%', marginTop: '8px' }}
                >
                    <Icons.LogoutIcon />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
