import React from 'react';
import AnimatedCounter from './AnimatedCounter';

const MetricCard = ({ title, value, icon: Icon, trend, color = 'primary', onClick, active }) => {
    return (
        <div
            className={`metric-card ${active ? 'active' : ''} ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
            style={{ 
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
                ...(active && { borderColor: 'var(--primary)', boxShadow: 'var(--soft-shadow)' })
            }}
        >
            <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="metric-icon" style={{ color: active ? 'var(--primary)' : 'var(--primary)' }}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
            </div>
            <div className="metric-body" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="metric-value" style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text)' }}>
                    <AnimatedCounter end={value} />
                </span>
                <span className="metric-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
            </div>
        </div>
    );
};

export default MetricCard;
