import React, { useState, useEffect, useCallback } from 'react';
import Icons from '../components/Icons';
import { testService } from '../services/testService';
import { useToast } from '../components/Toast';
import useSound from '../hooks/useSound';

const TestsList = ({ onStartTest }) => {
    const [tests, setTests] = useState({
        live: [],
        upcoming: [],
        completed: [],
        missed: []
    });
    const [activeTab, setActiveTab] = useState('live');
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const { playClick } = useSound();

    const fetchTests = useCallback(async () => {
        try {
            setIsLoading(true);
            const publishedTests = await testService.getPublishedTests();
            const now = new Date();

            // Fetch student attempts to categorize tests
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
            } catch (err) {
                console.warn('TestsList: Could not fetch attempts');
            }

            const completedTestIds = new Set(myAttempts.map(a => {
                if (typeof a.testId === 'object' && a.testId !== null) {
                    return a.testId.testId || a.testId._id || a.testId.id;
                }
                return a.testId;
            }));

            // Categorization
            const live = [];
            const upcoming = [];
            const completed = [];

            publishedTests.forEach(test => {
                const id = test.testId || test._id;
                const startDate = new Date(test.startDate || test.scheduledDate);

                if (completedTestIds.has(id)) {
                    const attempt = myAttempts.find(a => {
                        const tId = (typeof a.testId === 'object' && a.testId !== null)
                            ? (a.testId.testId || a.testId._id || a.testId.id)
                            : a.testId;
                        return tId === id;
                    });
                    completed.push({
                        ...test,
                        id,
                        title: test.topic,
                        percentage: attempt ? attempt.percentage || (attempt.score ? (attempt.score / (test.count * 2) * 100) : 0) : 0,
                        date: new Date(attempt?.createdAt || test.createdAt).toLocaleDateString()
                    });
                } else if (startDate <= now) {
                    live.push({ ...test, id, title: test.topic });
                } else {
                    upcoming.push({ ...test, id, title: test.topic });
                }
            });

            setTests({
                live,
                upcoming,
                completed,
                missed: []
            });
        } catch (error) {
            toast.error('Failed to load tests');
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    const tabs = [
        { id: 'live', label: 'Live Assessments', icon: <Icons.PlayIcon size={18} /> },
        { id: 'upcoming', label: 'Upcoming', icon: <Icons.CalendarIcon size={18} /> },
        { id: 'completed', label: 'Completed', icon: <Icons.CheckCircleIcon size={18} /> },
    ];

    return (
        <div className="tests-list-page">
            <div className="tabs-container" style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'var(--border-light)', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { playClick(); setActiveTab(tab.id); }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        <span className="count-badge" style={{ backgroundColor: activeTab === tab.id ? 'var(--primary-light)' : 'var(--border)', color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{tests[tab.id]?.length || 0}</span>
                    </button>
                ))}
            </div>

            <div className="tests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {isLoading ? (
                    <div className="loading-state" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '100px 0' }}>Loading assessments...</div>
                ) : tests[activeTab]?.length > 0 ? (
                    tests[activeTab].map(test => (
                        <div key={test.id} className="test-card-simple" style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', transition: 'all 0.3s ease' }}>
                            <div className="test-card-icon" style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icons.BookIcon size={24} />
                            </div>
                            <div className="test-card-info" style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: '600' }}>{test.title || test.topic}</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{test.subject || 'General'}</p>
                            </div>
                            {activeTab === 'live' && (
                                <button
                                    className="btn-take-test"
                                    onClick={() => onStartTest(test)}
                                    style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: '600', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
                                >
                                    Start
                                </button>
                            )}
                            {activeTab === 'completed' && (
                                <div className="result-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                    <span className="score" style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1rem' }}>{test.percentage}%</span>
                                    <span className="date" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{test.date}</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <Icons.InboxIcon size={48} color="var(--text-muted)" />
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>No tests found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestsList;
