import React, { useState, useEffect } from 'react';
import PerformanceGraph from '../components/PerformanceGraph';
import { BookIcon, TargetIcon, CheckCircleIcon, ChartIcon } from '../components/Icons';
import { testService } from '../services/testService';
import { DashboardSkeleton } from '../components/Skeleton';
import MetricCard from '../components/MetricCard';

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
            <div className="metric-grid">
                <MetricCard
                    title="Total Assigned"
                    value={stats.completed.length + stats.live.length + stats.upcoming.length}
                    icon={BookIcon}
                    color="primary"
                />
                <MetricCard
                    title="Completed"
                    value={stats.completed.length}
                    icon={CheckCircleIcon}
                    color="success"
                />
                <MetricCard
                    title="Live Assessments"
                    value={stats.live.length}
                    icon={TargetIcon}
                    color="danger"
                />
                <MetricCard
                    title="Average Score"
                    value={stats.completed.length > 0 ? 82 : 0} // Mock average score or calculate if possible
                    icon={ChartIcon}
                    color="warning"
                />
            </div>

            <div className="analytics-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="main-column">
                    <div className="question-section" style={{ marginBottom: '24px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="card-header" style={{ marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Inter', color: 'var(--text)' }}>Performance Trends</h3>
                        </div>
                        <PerformanceGraph data={stats.completed} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="question-section" style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                            <div className="card-header" style={{ marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Inter', color: 'var(--text)' }}>Top Strengths</h3>
                            </div>
                            <div className="test-meta" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className="meta-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>Mathematics</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>94% Avg</span>
                                </div>
                                <div className="meta-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>Physics</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>88% Avg</span>
                                </div>
                            </div>
                        </div>

                        <div className="question-section" style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                            <div className="card-header" style={{ marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', fontFamily: 'Inter', color: 'var(--text)' }}>Areas for Growth</h3>
                            </div>
                            <div className="test-meta" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div className="meta-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Chemistry</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>62% Avg</span>
                                </div>
                                <div className="meta-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--warning)', fontWeight: '600' }}>English</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>74% Avg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="side-column">
                    <div className="question-section" style={{ height: '100%', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                        <div className="card-header" style={{ marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', fontFamily: 'Inter', color: 'var(--text)' }}>Recent Activity</h3>
                        </div>
                        <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {stats.completed.length > 0 ? (
                                stats.completed.slice(0, 5).map(test => (
                                    <div key={test.testId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <CheckCircleIcon size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{test.topic}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {new Date(test.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>No recent activity to show</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
