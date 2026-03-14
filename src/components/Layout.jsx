import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, isDark, onThemeToggle, onLogout, title }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    const toggleSidebar = () => {
        setIsCollapsed(prev => {
            const newState = !prev;
            localStorage.setItem('sidebarCollapsed', newState);
            return newState;
        });
    };

    return (
        <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar onLogout={onLogout} isCollapsed={isCollapsed} />
            <main className="app-main">
                <Header
                    isDark={isDark}
                    onThemeToggle={onThemeToggle}
                    title={title}
                    onToggleSidebar={toggleSidebar}
                    isSidebarCollapsed={isCollapsed}
                />
                <div className="app-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
