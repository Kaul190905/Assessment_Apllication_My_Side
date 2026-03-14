import React from 'react';
import { NavLink } from 'react-router-dom';
import Icons from './Icons';
import useSound from '../hooks/useSound';

const Sidebar = ({ onLogout, isCollapsed }) => {
    const { playClick } = useSound();

    // Get user data for profile
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = userData.name || 'John Doe';
    const userRole = userData.role || 'Student';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    const navItems = [
        { path: '/', icon: <Icons.HomeIcon />, label: 'Dashboard' },
        { path: '/analytics', icon: <Icons.ChartIcon />, label: 'Analytics' },
    ];

    return (
        <aside 
            className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`} 
            style={{ 
                backgroundColor: 'var(--sidebar-bg)', 
                color: 'var(--sidebar-text)',
                borderRight: '1px solid var(--sidebar-border)'
            }}
        >
            <div className="sidebar-logo" style={{ 
                marginBottom: '32px', 
                display: 'flex', 
                justifyContent: isCollapsed ? 'center' : 'flex-start', 
                alignItems: 'center', 
                padding: isCollapsed ? '0' : '0 12px',
                width: '100%',
                height: '64px'
            }}>
                <img 
                    src={isCollapsed ? "/gradeflow-logo.png" : "/gradeflow-full-logo.png"} 
                    alt="Gradeflow" 
                    style={{ 
                        height: isCollapsed ? '36px' : '48px',
                        width: 'auto',
                        maxWidth: isCollapsed ? '36px' : '200px',
                        objectFit: 'contain',
                        display: 'block'
                    }} 
                />
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                        onClick={() => playClick()}
                        title={isCollapsed ? item.label : ''}
                        style={({ isActive }) => ({
                            color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                            backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        })}
                    >
                    {({ isActive }) => (
                        <>
                            <div className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{item.icon}</div>
                            {!isCollapsed && <span style={{ fontWeight: isActive ? '700' : '500' }}>{item.label}</span>}
                        </>
                    )}
                </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `user-profile-section ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
                    onClick={() => playClick()}
                    style={{ textDecoration: 'none', display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    title={isCollapsed ? userName : ''}
                >
                    <div className="user-avatar" style={{ backgroundColor: 'var(--primary)', color: 'white', flexShrink: 0, fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {userInitials}
                    </div>
                    {!isCollapsed && (
                        <div className="user-info" style={{ marginLeft: '12px' }}>
                            <span className="user-name" style={{ color: 'var(--text)', fontWeight: '600' }}>{userName}</span>
                            <span className="user-role" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{userRole}</span>
                        </div>
                    )}
                </NavLink>

                <button
                    className={`nav-item logout-btn ${isCollapsed ? 'collapsed' : ''}`}
                    onClick={() => { playClick(); onLogout(); }}
                    style={{ border: 'none', background: 'none', width: '100%', marginTop: '8px', justifyContent: isCollapsed ? 'center' : 'flex-start', color: 'var(--sidebar-text)' }}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <div className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.LogoutIcon /></div>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
