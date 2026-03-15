import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupBySubject } from '../data/assessments';
import PerformanceGraph from '../components/PerformanceGraph';
import CalendarView from '../components/CalendarView';
import ActivityFeed from '../components/ActivityFeed';
import FloatingActionButton from '../components/FloatingActionButton';
import { DashboardSkeleton } from '../components/Skeleton';
import useSound from '../hooks/useSound';
import { BookIcon, TargetIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon, CalendarIcon, SparklesIcon, TrendingUpIcon, ZapIcon, CloseIcon } from '../components/Icons';
import { testService } from '../services/testService';
import MetricCard from '../components/MetricCard';

const Dashboard = ({ isDark, onThemeToggle, onStartTest, onLogout }) => {
    const navigate = useNavigate();
    const { playClick, playSuccess } = useSound();

    // Loading state for skeleton
    const [isLoading, setIsLoading] = useState(true);

    // Assessments state - now fetched from backend
    const [assessments, setAssessments] = useState({
        upcoming: [],
        live: [],
        completed: [],
        missed: []
    });

    // State for categorizing tests by subject or status
    const [activeTab, setActiveTab] = useState('live');

    // For expanding/collapsing subject groups
    const [expandedCompleted, setExpandedCompleted] = useState(null);
    const [expandedMissed, setExpandedMissed] = useState(null);

    // State for feedback modal
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    const fetchPublishedTests = useCallback(async (showLoading = false) => {
        try {
            // Only show loading skeleton on initial load, not on auto-refresh
            if (showLoading) {
                setIsLoading(true);
            }

            // Check if user has auth token
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('No auth token found, but fetching public tests...');
            }

            const tests = await testService.getPublishedTests();
            console.log('Fetched tests from backend:', tests);

            // Transform backend tests to match your UI format
            // Logic implemented per user request: UTC -> Local Time conversion & Strict Categorization

            const now = new Date();
            console.log("Current Dashboard Time:", now.toString());

            const processedTests = tests.map(test => {
                // 1. Detect Scheduled Date (UTC from backend)
                // STRICTLY prioritize 'startDate' as per 'gradeflow' schema, but allow fallback to 'scheduledDate' for limited backward compat if needed.
                const rawSchedule = test.startDate || test.scheduledDate;

                let effectiveDate = null;
                let isScheduled = false;

                // 2. Strict Parsing & Validation
                if (rawSchedule) {
                    const d = new Date(rawSchedule); // Converts UTC to Student's Local Time
                    // Validate: Must be a valid Date AND not the epoch start (1970-01-01) which might indicate default/empty value
                    if (d instanceof Date && !isNaN(d) && d.getFullYear() > 1970) {
                        effectiveDate = d;
                        isScheduled = true;
                    }
                }

                // 3. Fallback (if no schedule, use creation time)
                if (!effectiveDate) {
                    effectiveDate = new Date(test.createdAt);
                    isScheduled = false;
                }

                // 4. Categorization Logic
                // "Upcoming" means strictly in the future
                const isUpcoming = effectiveDate.getTime() > now.getTime();

                return {
                    id: test.testId,
                    title: test.topic,
                    subject: test.topic,
                    instructor: 'Staff',

                    // 5. Formatted Display
                    date: effectiveDate.toLocaleDateString(),

                    // Formatted Time (e.g., "02:30 PM")
                    startTime: effectiveDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),

                    // Duration: Pass raw minutes for logic (Timer) and formatted string for UI
                    // Fallback to 60 minutes (schema default) if not provided, avoiding count-based heuristic
                    durationMinutes: test.duration || 60,
                    duration: test.duration ? `${test.duration} mins` : '60 mins',

                    questions: test.count,
                    marks: test.count * 2,
                    questionsData: test.questions,
                    difficulty: test.difficulty,
                    endTime: '11:59 PM',

                    // 6. Data for Sorting & Status
                    rawDate: effectiveDate,
                    isScheduled: isScheduled, // This flag can be used to distinguish "Scheduled" vs "Posted" items if needed
                    status: isUpcoming ? 'upcoming' : 'live',

                    // 7. Add raw date fields from backend for expiry checking
                    startDate: test.startDate, // Raw ISO string from backend
                    endDate: test.endDate,     // Raw ISO string from backend
                    createdAt: test.createdAt  // Raw ISO string from backend
                };
            });

            // Fetch student attempts to categorize tests
            let myAttempts = [];

            // 1. Try fetching from backend
            try {
                const allAttempts = await testService.getMyAttempts();
                // Get current student identifier (matches logic in TestPage)
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const studentIdentifier = userData.email || userData.id;

                if (!studentIdentifier) {
                    console.warn('No student identifier found, cannot filter attempts');
                    return;
                }

                // Filter attempts for this student
                myAttempts = allAttempts.filter(a => {
                    const sId = (typeof a.studentId === 'object' && a.studentId !== null)
                        ? (a.studentId.email || a.studentId.id || a.studentId._id)
                        : a.studentId;
                    return sId === studentIdentifier;
                });
            } catch (err) {
                console.warn('Could not fetch attempts from backend:', err.message);
            }

// Local fallback removed per user request

            // Create a set of completed test IDs for fast lookup
            const completedTestIds = new Set(myAttempts.map(a => {
                // Handle different potential structures of the populated testId
                if (typeof a.testId === 'object' && a.testId !== null) {
                    return a.testId.testId || a.testId._id || a.testId.id;
                }
                return a.testId;
            }));

            // Filter out completed tests from the processed list
            const incompleteTests = processedTests.filter(t => !completedTestIds.has(t.id));

            // Separate expired tests (not completed by student but past endDate)
            const expiredTests = incompleteTests.filter(t => {
                if (!t.endDate) return false;
                const expirationDate = new Date(t.endDate);
                const isExpired = expirationDate <= now;
                if (isExpired) {
                    console.log(`🔴 EXPIRED TEST FOUND: ${t.title} `, {
                        testId: t.id,
                        endDate: t.endDate,
                        expirationDate: expirationDate.toLocaleString(),
                        now: now.toLocaleString(),
                        isExpired
                    });
                }
                return isExpired;
            });

            console.log(`📊 Expired Tests Count: ${expiredTests.length} `, expiredTests.map(t => t.title));

            // Filter out expired tests from active tests
            const activeTests = incompleteTests.filter(t => {
                if (!t.endDate) return true; // No expiry date means always active
                const expirationDate = new Date(t.endDate);
                return expirationDate > now;
            });

            // Split into Upcoming and Live based on the STRICT Logic requested:
            // "Upcoming" means effectiveDate > now
            // "Live" means effectiveDate <= now

            const upcomingTests = activeTests
                .filter(t => t.rawDate.getTime() > now.getTime())
                .sort((a, b) => a.rawDate - b.rawDate) // Sort Ascending (Soonest first)
                .map(t => ({ ...t, status: 'upcoming' }));

            const liveTests = activeTests
                .filter(t => t.rawDate.getTime() <= now.getTime())
                .sort((a, b) => b.rawDate - a.rawDate) // Sort Descending (Newest first)
                .map(t => ({ ...t, status: 'live' }));

            const completedTests = processedTests.filter(t => completedTestIds.has(t.id)).map(test => {
                const attempt = myAttempts.find(a => {
                    const tId = (typeof a.testId === 'object' && a.testId !== null)
                        ? (a.testId.testId || a.testId._id || a.testId.id)
                        : a.testId;
                    return tId === test.id;
                });
                return {
                    ...test,
                    status: 'completed',
                    percentage: attempt ? attempt.percentage || (attempt.score ? (attempt.score / test.marks * 100) : 0) : 0,
                    score: attempt ? attempt.score : 0,
                    attemptId: attempt ? attempt._id || attempt.id : null
                };
            });



            // Categorize tests - add expired tests to missed
            const missedTests = expiredTests.map(test => ({
                ...test,
                status: 'expired'
            }));

            console.log('📋 Final Categorization:', {
                upcoming: upcomingTests.length,
                live: liveTests.length,
                completed: completedTests.length,
                missed: missedTests.length
            });

            setAssessments({
                upcoming: upcomingTests,
                live: liveTests,
                completed: completedTests,
                missed: missedTests
            });

            // Only show toast notifications on initial load, not during auto-refresh
            if (showLoading) {
                // Toasts removed per user request
            }
        } catch (error) {
            console.error('Failed to fetch tests:', error);

            // Only show toast notifications on initial load, not during auto-refresh
            if (showLoading) {
                if (error.message.includes('Not authorized') || error.message.includes('token')) {
                    console.log('Authentication required');
                } else {
                    console.error('Failed to load tests from backend');
                }
            }

            // Fallback to empty state
            setAssessments({
                upcoming: [],
                live: [],
                completed: [],
                missed: []
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch published tests from backend (initial load with loading state)
    useEffect(() => {
        fetchPublishedTests(true); // Show loading skeleton on initial load
    }, [fetchPublishedTests]);

    // Automatic refresh to check for expired tests every 60 seconds
    useEffect(() => {
        // Set up interval to refresh tests every minute
        const refreshInterval = setInterval(() => {
            console.log('Auto-refreshing tests to check for expiration...');
            fetchPublishedTests(false); // Don't show loading skeleton on auto-refresh
        }, 60000); // 60 seconds

        // Cleanup interval on component unmount
        return () => {
            console.log('Cleaning up auto-refresh interval');
            clearInterval(refreshInterval);
        };
    }, [fetchPublishedTests]);

    const handleStartTest = (test) => {
        if (assessments.completed.some(t => t.id === test.id)) {
            return;
        }

        // Check if test has expired (additional frontend validation)
        if (test.endDate) {
            const now = new Date();
            const expirationDate = new Date(test.endDate);
            if (expirationDate <= now) {
                return;
            }
        }

        playSuccess();
        console.log(`Starting ${test.title}...`);
        onStartTest(test);
        navigate('/rules');
    };


    const toggleCompleted = (subject) => {
        playClick();
        setExpandedCompleted(prev => prev === subject ? null : subject);
    };

    const toggleMissed = (subject) => {
        playClick();
        setExpandedMissed(prev => prev === subject ? null : subject);
    };

    const handleViewFeedback = (test, e) => {
        e.stopPropagation();
        playClick();
        setSelectedTest(test);
        setShowFeedback(true);
    };

    const closeFeedback = () => {
        setShowFeedback(false);
        setSelectedTest(null);
    };

    // Generate recommendations based on score
    const getRecommendations = (test) => {
        const percentage = test.percentage;
        if (percentage >= 90) {
            return {
                grade: 'Excellent',
                gradeClass: 'excellent',
                message: 'Outstanding performance! You have demonstrated exceptional understanding of the subject.',
                tips: [
                    'Continue to challenge yourself with advanced topics',
                    'Consider helping peers who may be struggling',
                    'Explore additional resources to deepen your expertise'
                ]
            };
        } else if (percentage >= 70) {
            return {
                grade: 'Good',
                gradeClass: 'good',
                message: 'Great job! You have a solid understanding of the core concepts.',
                tips: [
                    'Review the questions you missed to identify knowledge gaps',
                    'Practice more problems to strengthen weak areas',
                    'Keep up the consistent effort'
                ]
            };
        } else if (percentage >= 50) {
            return {
                grade: 'Average',
                gradeClass: 'average',
                message: 'You passed, but there is room for improvement.',
                tips: [
                    'Revisit the fundamental concepts of this subject',
                    'Create a study schedule to cover weak topics',
                    'Seek help from instructors or study groups',
                    'Practice regularly with sample questions'
                ]
            };
        } else {
            return {
                grade: 'Needs Improvement',
                gradeClass: 'low',
                message: 'This assessment indicates areas that need significant attention.',
                tips: [
                    'Schedule a meeting with your instructor for guidance',
                    'Focus on understanding the basics before moving forward',
                    'Use video tutorials and additional learning resources',
                    'Consider forming a study group for collaborative learning',
                    'Practice consistently and track your progress'
                ]
            };
        }
    };


    // Group assessments by subject
    const groupedCompleted = groupBySubject(assessments.completed);
    const groupedMissed = assessments.missed ? groupBySubject(assessments.missed) : {};

    // Calculate stats
    const totalTests = assessments.completed.length;

    // Generate specialized activities
    const activities = [];

    // 1. Last Test Attended Details
    if (assessments.completed.length > 0) {
        // Sort by rawDate to likely find the most relevant one, or ideally by attempt date if available
        // Using rawDate (test schedule) as a proxy for now
        const lastAttended = [...assessments.completed].sort((a, b) => b.rawDate - a.rawDate)[0];

        activities.push({
            type: 'test_completed',
            title: `Last Attended: ${lastAttended.title} `,
            description: `Completed on ${lastAttended.date} `,
            timestamp: lastAttended.date,
            id: 'last-attended'
        });
    }

    // 2. Recent Test Posted by Staff
    const allActive = [...assessments.live, ...assessments.upcoming];
    if (allActive.length > 0) {
        const recentPosted = allActive.sort((a, b) => b.rawDate - a.rawDate)[0];

        activities.push({
            type: 'announcement',
            title: `Recent Test Posted: ${recentPosted.title} `,
            description: `Scheduled for ${recentPosted.date} at ${recentPosted.startTime} `,
            timestamp: 'New',
            id: 'recent-posted'
        });
    }

    if (isLoading) {
        return (
            <div className="dashboard">
                <DashboardSkeleton />
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Modern Metric Grid */}
            <div className="metric-grid">
                <MetricCard
                    title="Upcoming"
                    value={assessments.upcoming.length}
                    icon={BookIcon}
                    color="primary"
                    active={activeTab === 'upcoming'}
                    onClick={() => { playClick(); setActiveTab('upcoming'); }}
                />
                <MetricCard
                    title="Live Now"
                    value={assessments.live.length}
                    icon={TargetIcon}
                    color="danger"
                    active={activeTab === 'live'}
                    onClick={() => { playClick(); setActiveTab('live'); }}
                />
                <MetricCard
                    title="Completed"
                    value={totalTests}
                    icon={CheckCircleIcon}
                    color="success"
                    active={activeTab === 'completed'}
                    onClick={() => { playClick(); setActiveTab('completed'); }}
                />
                <MetricCard
                    title="Missed"
                    value={assessments.missed.length}
                    icon={AlertCircleIcon}
                    color="warning"
                    active={activeTab === 'missed'}
                    onClick={() => { playClick(); setActiveTab('missed'); }}
                />
            </div>


            {/* Main Content Area - Shows content based on active tab */}
            {/* Live Assessments */}
            {activeTab === 'live' && (
                <>
                    <section id="live-section" className="assessment-section">
                        {assessments.live.length > 0 ? (
                            <>
                                <h2 className="section-title">
                                    <span className="live-dot"></span>
                                    Live Assessments
                                </h2>
                                <div className="assessment-grid">
                                    {assessments.live.map((test) => (
                                        <div key={test.id} className="assessment-card">
                                            <div className="card-badge-container">
                                                <span className="badge badge--subject">{test.subject}</span>
                                                <span className="badge badge--status badge--live">LIVE</span>
                                            </div>

                                            <h3 className="card-title">{test.title}</h3>

                                            <div className="card-meta">
                                                <div className="meta-item">
                                                    <ClockIcon size={14} />
                                                    <span>{test.duration}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <BookIcon size={14} />
                                                    <span>{test.questions} Qs</span>
                                                </div>
                                                <div className="meta-item">
                                                    <TargetIcon size={14} />
                                                    <span>{test.difficulty}</span>
                                                </div>
                                            </div>

                                            {test.endDate && (
                                                <div className="expiry-notice expiry-notice--urgent">
                                                    <ClockIcon size={14} />
                                                    <span>Expires {new Date(test.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            )}

                                            <button
                                                className="btn-start"
                                                onClick={() => handleStartTest(test)}
                                                style={{ width: '100%' }}
                                            >
                                                Start Assessment
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="empty-state">
                                <p>No live assessments at the moment.</p>
                            </div>
                        )}
                    </section>

                    <div className="dashboard-widgets">
                        <div className="widget-column">
                            {/* Performance Graph in Live Section */}
                            <div id="performance-section">
                                <PerformanceGraph data={assessments.completed} />
                            </div>
                        </div>

                        {/* Right Column - Calendar and Activity in Live Section */}
                        <div id="calendar-section" className="widget-column">
                            <CalendarView events={[...assessments.live, ...assessments.upcoming, ...assessments.completed, ...assessments.missed]} />
                            <ActivityFeed activities={activities} />
                        </div>
                    </div>
                </>
            )}

            {/* Upcoming Assessments */}
            {activeTab === 'upcoming' && (
                <section id="upcoming-section" className="assessment-section">
                    {assessments.upcoming.length > 0 ? (
                        <>
                            <h2 className="section-title">
                                <span className="upcoming-dot" style={{ backgroundColor: '#FFC107' }}></span>
                                Upcoming Scheduled Assessments
                            </h2>
                            <div className="assessment-grid">
                                {assessments.upcoming.map((test) => (
                                    <div key={test.id} className="assessment-card">
                                        <div className="card-badge-container">
                                            <span className="badge badge--subject">{test.subject}</span>
                                            <span className="badge badge--status badge--upcoming">UPCOMING</span>
                                        </div>

                                        <h3 className="card-title">{test.title}</h3>
                                        <p className="card-instructor">By {test.instructor}</p>

                                        <div className="expiry-notice expiry-notice--upcoming">
                                            <CalendarIcon size={14} />
                                            <span>{test.date} at {test.startTime}</span>
                                        </div>

                                        <div className="card-meta">
                                            <div className="meta-item">
                                                <ClockIcon size={14} />
                                                <span>{test.duration}</span>
                                            </div>
                                        </div>

                                        <button
                                            className="btn-upcoming"
                                            disabled
                                        >
                                            Available at {test.startTime}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <p>No upcoming assessments scheduled.</p>
                        </div>
                    )}
                </section>
            )}

            {/* Missed Tests Tab */}
            {activeTab === 'missed' && (
                <section id="missed-section" className="assessment-section">
                    {assessments.missed && assessments.missed.length > 0 ? (
                        <>
                            <h2 className="section-title missed-title">
                                <span className="missed-dot" style={{ backgroundColor: '#ff6b6b' }}></span>
                                Missed & Expired Tests
                            </h2>
                            <div className="topic-boxes-grid">
                                {Object.entries(groupedMissed).map(([subject, tests]) => (
                                    <div
                                        key={subject}
                                        className={`topic - box missed ${expandedMissed === subject ? 'active' : ''} `}
                                        onClick={() => toggleMissed(subject)}
                                    >
                                        <span className="topic-name">{subject}</span>
                                        <span className="topic-count">{tests.length}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Expanded Content */}
                            {expandedMissed && groupedMissed[expandedMissed] && (
                                <div className="expanded-content missed-content">
                                    <div className="expanded-header">
                                        <h3>{expandedMissed}</h3>
                                        <button className="btn-close" onClick={() => setExpandedMissed(null)}><CloseIcon size={20} /></button>
                                    </div>
                                    <div className="assessment-grid">
                                        {groupedMissed[expandedMissed].map((test) => (
                                            <div key={test.id} className="assessment-card">
                                                <div className="card-badge-container">
                                                    <span className="badge badge--subject">{test.subject}</span>
                                                    <span className="badge badge--status">
                                                        {test.status === 'expired' ? 'EXPIRED' : 'MISSED'}
                                                    </span>
                                                </div>
                                                <h3 className="card-title">{test.title}</h3>
                                                <p className="card-instructor">By {test.instructor}</p>

                                                <div className="expiry-notice expiry-notice--urgent" style={{ marginTop: 'auto' }}>
                                                    <AlertCircleIcon size={14} />
                                                    <span>Was scheduled for {test.date}</span>
                                                </div>

                                                <button className="btn-start disabled" disabled style={{ width: '100%', opacity: 0.5 }}>
                                                    Not Available
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <p>No missed or expired tests.</p>
                        </div>
                    )}
                </section>
            )}

            {/* Completed Assessments and Dashboard Widgets */}
            {activeTab === 'completed' && (
                <div className="dashboard-widgets">
                    <div className="widget-column">
                        {/* Completed Assessments - Topic Boxes */}
                        <section id="completed-section" className="assessment-section">
                            <h2 className="section-title">Completed Assessments</h2>
                            {Object.keys(groupedCompleted).length > 0 ? (
                                <>
                                    <div className="topic-boxes-grid">
                                        {Object.entries(groupedCompleted).map(([subject, tests]) => (
                                            <div
                                                key={subject}
                                                className={`topic-box ${expandedCompleted === subject ? 'active' : ''}`}
                                                onClick={() => toggleCompleted(subject)}
                                            >
                                                <div className="topic-header">
                                                    <span className="topic-name">{subject}</span>
                                                    <span className="topic-count">{tests.length} tests</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedCompleted && groupedCompleted[expandedCompleted] && (
                                        <div className="expanded-content">
                                            <div className="expanded-header">
                                                <h3>{expandedCompleted}</h3>
                                                <button className="btn-close" onClick={() => setExpandedCompleted(null)}><CloseIcon size={20} /></button>
                                            </div>
                                            <div className="assessment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                                {groupedCompleted[expandedCompleted].map((test) => (
                                                    <div key={test.id} className="assessment-card">
                                                        <div className="card-badge-container">
                                                            <span className="badge badge--subject">{test.subject}</span>
                                                            <span className="badge badge--status badge--completed">COMPLETED</span>
                                                        </div>
                                                        <h4 className="card-title" style={{ fontSize: '1rem' }}>{test.title}</h4>
                                                        <p className="card-instructor">{test.instructor} • {test.date}</p>

                                                        <button
                                                            className="btn-view-summary"
                                                            onClick={(e) => handleViewFeedback(test, e)}
                                                            style={{ marginTop: 'auto', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}
                                                        >
                                                            View Summary
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state">
                                    <p>No completed assessments yet.</p>
                                </div>
                            )}
                        </section>

                        {/* Performance Graph */}
                        <div id="performance-section">
                            <PerformanceGraph data={assessments.completed} />
                        </div>
                    </div>

                    {/* Right Column - Calendar and Activity */}
                    <div id="calendar-section" className="widget-column">
                        <CalendarView events={[...assessments.live, ...assessments.upcoming, ...assessments.completed, ...assessments.missed]} />
                        <ActivityFeed activities={activities} />
                    </div>
                </div>
            )}


            {/* Floating Action Button */}
            <FloatingActionButton />

            {/* Summary Modal - Assessment Wrap-up */}
            {showFeedback && selectedTest && (
                <div className="summary-modal" onClick={closeFeedback}>
                    <div className="summary-card" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-close-modal" onClick={closeFeedback}><CloseIcon size={20} /></button>

                        {/* Illustration Area */}
                        <div className="summary-illustration">
                            <div className={`illustration - icon ${getRecommendations(selectedTest).gradeClass} `}>
                                {getRecommendations(selectedTest).gradeClass === 'excellent' && <TargetIcon size={48} />}
                                {getRecommendations(selectedTest).gradeClass === 'good' && <SparklesIcon size={48} />}
                                {getRecommendations(selectedTest).gradeClass === 'average' && <TrendingUpIcon size={48} />}
                                {getRecommendations(selectedTest).gradeClass === 'low' && <ZapIcon size={48} />}
                            </div>
                        </div>

                        {/* Key Heading */}
                        <div className="summary-header">
                            <h2>Assessment Complete</h2>
                            <p className="summary-title">{selectedTest.title}</p>
                        </div>

                        {/* One-line Feedback */}
                        <div className="summary-feedback">
                            <p>You have successfully completed this assessment.</p>
                        </div>

                        {/* Recommendations */}
                        <div className="summary-recommendations">
                            <h4>What's Next?</h4>
                            <ul>
                                {getRecommendations(selectedTest).tips.slice(0, 3).map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Close Button */}
                        <button className="btn-close-summary" onClick={closeFeedback}>
                            Close Summary
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
