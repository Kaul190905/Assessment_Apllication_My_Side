import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HomeIcon } from './Icons';

const Breadcrumb = () => {
    const location = useLocation();

    // Define route labels
    const routeLabels = {
        '/': 'Dashboard',
        '/login': 'Login',
        '/profile': 'Profile',
        '/test': 'Test',
        '/rules': 'Test Rules'
    };

    // Get current path
    const currentPath = location.pathname;

    // Build breadcrumb items
    const getBreadcrumbs = () => {
        const items = [];

        // Always add home
        items.push({
            path: '/',
            label: 'Dashboard',
            isHome: true
        });

        // Add current page if not home
        if (currentPath !== '/') {
            items.push({
                path: currentPath,
                label: routeLabels[currentPath] || currentPath.replace('/', ''),
                isCurrent: true
            });
        }

        return items;
    };

    const breadcrumbs = getBreadcrumbs();

    // Don't show breadcrumb on login page
    if (currentPath === '/login') {
        return null;
    }

    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                {breadcrumbs.map((item, index) => (
                    <li key={item.path} className="breadcrumb-item">
                        {index > 0 && <span className="breadcrumb-separator">›</span>}
                        {item.isCurrent ? (
                            <span className="breadcrumb-current" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.path} className="breadcrumb-link">
                                {item.isHome && <span className="home-icon"><HomeIcon size={16} /></span>}
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
