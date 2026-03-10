import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, isDark, onThemeToggle, onLogout, title }) => {
    return (
        <div className="app-layout">
            <Sidebar onLogout={onLogout} />
            <main className="app-main">
                <Header
                    isDark={isDark}
                    onThemeToggle={onThemeToggle}
                    title={title}
                />
                <div className="app-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
