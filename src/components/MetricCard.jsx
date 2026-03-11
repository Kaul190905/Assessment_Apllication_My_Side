import React from 'react';
import AnimatedCounter from './AnimatedCounter';

const MetricCard = ({ title, value, icon: Icon, trend, color = 'primary', onClick, active }) => {
    return (
        <div
            className={`metric-card ${color} ${active ? 'active' : ''} ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <div className="metric-header">
                <div className={`metric-icon-bg ${color}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className={`metric-trend ${trend.type}`}>
                        {trend.type === 'up' ? '↑' : '↓'} {trend.value}%
                    </span>
                )}
            </div>
            <div className="metric-body">
                <AnimatedCounter end={value} className="metric-value" />
                <span className="metric-label">{title}</span>
            </div>
        </div>
    );
};

export default MetricCard;
