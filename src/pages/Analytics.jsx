import React, { useState, useEffect } from 'react';
import PerformanceGraph from '../components/PerformanceGraph';
import AnimatedCounter from '../components/AnimatedCounter';
import { BookIcon, TargetIcon, CheckCircleIcon } from '../components/Icons';
import { testService } from '../services/testService';
import { DashboardSkeleton } from '../components/Skeleton';

const Analytics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        completed: [],
        upcoming: [],
        live: [],
        missed: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const tests = await testService.getPublishedTests();

                let myAttempts = [];
                try {
                    const allAttempts = await testService.getMyAttempts();
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    const studentIdentifier = userData.email || 'STU2025001';

                    myAttempts = allAttempts.filter(a => {
                        const sId = (typeof a.studentId === 'object' && a.studentId !== null)
                            ? (a.studentId.email || a.studentId.id || a.studentId._id)
                            : a.studentId;
                        return sId === studentIdentifier;
                    });
                } catch (e) {
                    console.warn('Analytics: Could not fetch attempts');
                }

                const completedIds = new Set(myAttempts.map(a => {
                    if (typeof a.testId === 'object' && a.testId !== null) {
                        return a.testId.testId || a.testId._id || a.testId.id;
                    }
                    return a.testId;
                }));

                const completed = tests.filter(t => completedIds.has(t.testId));
                const pending = tests.filter(t => !completedIds.has(t.testId));

                setStats({
                    completed,
                    upcoming: pending.filter(t => new Date(t.startDate) > new Date()),
                    live: pending.filter(t => new Date(t.startDate) <= new Date()),
                    missed: [] // Logic for missed can be added if needed
                });
            } catch (error) {
                console.error('Analytics: Failed to fetch data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="analytics-page">
            <div className="analytics-overview">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper primary"><BookIcon size={24} /></div>
                        <div className="stat-info">
                            <AnimatedCounter end={stats.completed.length + stats.live.length + stats.upcoming.length} />
                            <span className="stat-label">Total Assigned</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper success"><CheckCircleIcon size={24} /></div>
                        <div className="stat-info">
                            <AnimatedCounter end={stats.completed.length} />
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper danger"><TargetIcon size={24} /></div>
                        <div className="stat-info">
                            <AnimatedCounter end={stats.live.length} />
                            <span className="stat-label">Live Tests</span>
                        </div>
                    </div>
                </div>

                <div className="analytics-main-chart">
                    <PerformanceGraph data={stats.completed} />
                </div>

                <div className="analytics-insights-grid">
                    <div className="insight-card">
                        <div className="card-header">
                            <span className="dot-indicator"></span>
                            <h3>Top Strengths Across Subjects</h3>
                        </div>
                        <div className="empty-insight-placeholder">
                            <p>No insights available yet</p>
                        </div>
                    </div>

                    <div className="insight-card">
                        <div className="card-header">
                            <span className="dot-indicator"></span>
                            <h3>Competitive Performance</h3>
                        </div>
                        <div className="empty-insight-placeholder">
                            <p>No data yet</p>
                        </div>
                    </div>
                </div>

                <div className="attention-section">
                    <div className="attention-card">
                        <h3>Areas Needing Attention</h3>
                        <div className="empty-attention-placeholder">
                            <p>No data yet</p>
                        </div>
                    </div>
                </div>

                <div className="analytics-card recent-activity-full">
                    <h3>Recent Activity</h3>
                    <div className="activity-list-simple">
                        {stats.completed.length > 0 ? (
                            stats.completed.slice(0, 5).map(test => (
                                <div key={test.testId} className="activity-item-mini">
                                    <span className="activity-dot"></span>
                                    <div className="activity-text">
                                        <strong>{test.topic}</strong>
                                        <span>Completed on {new Date(test.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
