import React from 'react';
import { CheckIcon, PlayIcon, StarIcon, CalendarIcon, TrophyIcon, InboxIcon } from './Icons';

const ActivityFeed = ({ activities }) => {
    // Get relative time string
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Activity icons based on type
    const getActivityIcon = (type) => {
        switch (type) {
            case 'test_completed':
                return <CheckIcon size={18} color="white" />;
            case 'test_started':
                return <PlayIcon size={18} color="white" />;
            case 'score_received':
                return <StarIcon size={18} color="white" />;
            case 'test_scheduled':
                return <CalendarIcon size={18} color="white" />;
            case 'achievement':
                return <TrophyIcon size={18} color="white" />;
            default:
                return <CheckIcon size={18} color="white" />;
        }
    };

    // Get activity color based on type
    const getActivityColor = (type) => {
        switch (type) {
            case 'test_completed':
                return 'var(--success)';
            case 'test_started':
                return 'var(--primary)';
            case 'score_received':
                return 'var(--warning)';
            case 'test_scheduled':
                return 'var(--text-secondary)';
            case 'achievement':
                return 'var(--primary)';
            default:
                return 'var(--text-secondary)';
        }
    };

    // Generate sample activities from completed tests if not provided
    const generateActivities = () => {
        if (activities && activities.length > 0) return activities;

        // Default sample activities
        return [
            {
                type: 'test_completed',
                title: 'Completed Mathematics Quiz',
                description: 'Unit 3 Assessment submitted successfully',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                type: 'test_completed',
                title: 'Test Submitted',
                description: 'Physics Mid-term submitted for review',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
                type: 'test_scheduled',
                title: 'New Test Scheduled',
                description: 'Chemistry Final Exam on Dec 28',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
                type: 'achievement',
                title: 'Achievement Unlocked',
                description: 'Completed 10 tests this month!',
                timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
            }
        ];
    };

    const displayActivities = generateActivities();

    return (
        <div className="activity-feed">
            <h3 className="feed-title">Recent Activity</h3>
            <div className="activity-list">
                {displayActivities.map((activity, index) => (
                    <div
                        key={index}
                        className="activity-item"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div
                            className="activity-icon"
                            style={{ backgroundColor: getActivityColor(activity.type) }}
                        >
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="activity-content">
                            <div className="activity-header">
                                <span className="activity-title">{activity.title}</span>
                                <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
                            </div>
                            <p className="activity-description">{activity.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {displayActivities.length === 0 && (
                <div className="activity-empty">
                    <span className="empty-icon"><InboxIcon size={32} /></span>
                    <p>No recent activity</p>
                </div>
            )}
        </div>
    );
};

export default ActivityFeed;
