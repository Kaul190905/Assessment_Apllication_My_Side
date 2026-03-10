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
            <div className="tabs-container">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { playClick(); setActiveTab(tab.id); }}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        <span className="count-badge">{tests[tab.id]?.length || 0}</span>
                    </button>
                ))}
            </div>

            <div className="tests-grid">
                {isLoading ? (
                    <div className="loading-state">Loading assessments...</div>
                ) : tests[activeTab]?.length > 0 ? (
                    tests[activeTab].map(test => (
                        <div key={test.id} className="test-card-simple">
                            <div className="test-card-icon">
                                <Icons.BookIcon color="var(--primary)" />
                            </div>
                            <div className="test-card-info">
                                <h3>{test.title || test.topic}</h3>
                                <p>{test.subject || 'General'}</p>
                            </div>
                            {activeTab === 'live' && (
                                <button
                                    className="btn-take-test"
                                    onClick={() => onStartTest(test)}
                                >
                                    Take Test
                                </button>
                            )}
                            {activeTab === 'completed' && (
                                <div className="result-badge">
                                    <span className="score">{test.percentage}%</span>
                                    <span className="date">{test.date}</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <Icons.InboxIcon size={48} color="var(--text-muted)" />
                        <p>No tests found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestsList;
