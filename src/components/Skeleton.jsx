import React from 'react';

// Base Skeleton Component
const Skeleton = ({ width, height, borderRadius = '8px', className = '' }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius
            }}
        />
    );
};

// Text Skeleton - for text placeholders
export const SkeletonText = ({ lines = 3, lastLineWidth = '60%' }) => {
    return (
        <div className="skeleton-text">
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton
                    key={i}
                    height="16px"
                    width={i === lines - 1 ? lastLineWidth : '100%'}
                    className="skeleton-line"
                />
            ))}
        </div>
    );
};

// Circle Skeleton - for avatars
export const SkeletonCircle = ({ size = '40px' }) => {
    return (
        <Skeleton
            width={size}
            height={size}
            borderRadius="50%"
        />
    );
};

// Card Skeleton - for card placeholders
export const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card-header">
                <Skeleton width="80px" height="24px" borderRadius="12px" />
                <Skeleton width="60px" height="20px" />
            </div>
            <Skeleton height="28px" width="70%" className="skeleton-title" />
            <Skeleton height="16px" width="50%" />
            <div className="skeleton-card-details">
                <Skeleton height="14px" width="40%" />
                <Skeleton height="14px" width="45%" />
                <Skeleton height="14px" width="35%" />
            </div>
            <Skeleton height="44px" borderRadius="10px" className="skeleton-button" />
        </div>
    );
};

// Stats Card Skeleton
export const SkeletonStats = () => {
    return (
        <div className="skeleton-stats">
            <SkeletonCircle size="60px" />
            <div className="skeleton-stats-content">
                <Skeleton width="60px" height="32px" />
                <Skeleton width="100px" height="14px" />
            </div>
        </div>
    );
};

// Dashboard Loading Skeleton
export const DashboardSkeleton = () => {
    return (
        <div className="dashboard-skeleton">
            {/* Header Skeleton */}
            <div className="skeleton-header">
                <Skeleton width="200px" height="32px" />
                <div className="skeleton-header-right">
                    <SkeletonCircle size="40px" />
                    <Skeleton width="100px" height="20px" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="skeleton-stats-grid">
                {[1, 2, 3, 4].map(i => (
                    <SkeletonStats key={i} />
                ))}
            </div>

            {/* Cards Skeleton */}
            <Skeleton width="180px" height="24px" className="skeleton-section-title" />
            <div className="skeleton-cards-grid">
                {[1, 2, 3].map(i => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
    return (
        <div className="profile-skeleton">
            <div className="skeleton-profile-card">
                <SkeletonCircle size="120px" />
                <div className="skeleton-profile-info">
                    <Skeleton width="200px" height="28px" />
                    <Skeleton width="180px" height="16px" />
                    <Skeleton width="120px" height="24px" borderRadius="12px" />
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
