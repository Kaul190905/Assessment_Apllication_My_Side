import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupBySubject } from '../data/assessments';
import ThemeToggle from '../components/ThemeToggle';
import Breadcrumb from '../components/Breadcrumb';
import AnimatedCounter from '../components/AnimatedCounter';
import PerformanceGraph from '../components/PerformanceGraph';
import CalendarView from '../components/CalendarView';
import ActivityFeed from '../components/ActivityFeed';
import FloatingActionButton from '../components/FloatingActionButton';
import MobileSidebar, { HamburgerButton } from '../components/MobileSidebar';
import { DashboardSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import useSound from '../hooks/useSound';
import { BookIcon, TargetIcon, CheckCircleIcon, ChartIcon, StarIcon } from '../components/Icons';
import { testService } from '../services/testService';

const Dashboard = ({ isDark, onThemeToggle, onStartTest, onLogout }) => {
    const navigate = useNavigate();
    const toast = useToast();
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

    // Mobile sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Tab state for filtering sessions
    const [activeTab, setActiveTab] = useState('live');

    // State for expanded subject groups
    const [expandedUpcoming, setExpandedUpcoming] = useState(null);
    const [expandedCompleted, setExpandedCompleted] = useState(null);
    const [expandedMissed, setExpandedMissed] = useState(null);

    // State for feedback modal
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    // Fetch published tests from backend
    useEffect(() => {
        fetchPublishedTests();
    }, []);

    const fetchPublishedTests = async () => {
        try {
            setIsLoading(true);
            
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
                    status: isUpcoming ? 'upcoming' : 'live'
                };
            });

            // Fetch student attempts to categorize tests
            let myAttempts = [];
            
            // 1. Try fetching from backend
            try {
                const allAttempts = await testService.getMyAttempts();
                // Get current student identifier (matches logic in TestPage)
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const studentIdentifier = userData.email || 'STU2025001';
                
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

            // 2. Merge with local attempts (fallback for demo mode)
            const localAttempts = JSON.parse(localStorage.getItem('localAttempts') || '[]');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const studentIdentifier = userData.email || 'STU2025001';

            localAttempts.forEach(local => {
                // If this test isn't already in myAttempts, add it
                const exists = myAttempts.some(a => {
                    const tId = (typeof a.testId === 'object' && a.testId !== null)
                        ? (a.testId.testId || a.testId._id || a.testId.id)
                        : a.testId;
                    return tId === local.testId;
                });
                
                if (!exists && local.studentId === studentIdentifier) {
                    myAttempts.push(local);
                }
            });

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

            // Split into Upcoming and Live based on the STRICT Logic requested:
            // "Upcoming" means effectiveDate > now
            // "Live" means effectiveDate <= now
            
            const upcomingTests = incompleteTests
                .filter(t => t.rawDate.getTime() > now.getTime())
                .sort((a, b) => a.rawDate - b.rawDate); // Sort Ascending (Soonest first)
                
            const liveTests = incompleteTests
                .filter(t => t.rawDate.getTime() <= now.getTime())
                .sort((a, b) => b.rawDate - a.rawDate); // Sort Descending (Newest first)

            const completedTests = processedTests.filter(t => completedTestIds.has(t.id)).map(test => {
                const attempt = myAttempts.find(a => {
                    const tId = (typeof a.testId === 'object' && a.testId !== null)
                        ? (a.testId.testId || a.testId._id || a.testId.id)
                        : a.testId;
                    return tId === test.id;
                });
                return {
                    ...test,
                    percentage: attempt ? attempt.percentage || (attempt.score ? (attempt.score / test.marks * 100) : 0) : 0,
                    score: attempt ? attempt.score : 0,
                    attemptId: attempt ? attempt._id || attempt.id : null
                };
            });



            // Categorize tests
            setAssessments({
                upcoming: upcomingTests,
                live: liveTests,
                completed: completedTests,
                missed: []
            });

            if (processedTests.length > 0) {
                toast.success(`Loaded ${processedTests.length} published test(s)`);
            } else {
                toast.info('No published tests available at the moment');
            }
        } catch (error) {
            console.error('Failed to fetch tests:', error);
            
            // Check if it's an authentication error
            if (error.message.includes('Not authorized') || error.message.includes('token')) {
                console.log('Authentication required - using demo mode');
                toast.info('Using demo mode. Login with backend credentials to see published tests.');
            } else {
                toast.error('Failed to load tests from backend');
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
    };

    const handleStartTest = (test) => {
        // Prevent re-taking completed tests
        if (assessments.completed.some(t => t.id === test.id)) {
            toast.error('You have already completed this test.');
            return;
        }

        // Check if test has expired (additional frontend validation)
        if (test.endDate) {
            const now = new Date();
            const expirationDate = new Date(test.endDate);
            if (expirationDate <= now) {
                toast.error('This test has expired and is no longer accessible.');
                return;
            }
        }

        playSuccess();
        toast.info(`Starting ${test.title}...`);
        onStartTest(test);
        navigate('/rules');
    };

    const handleProfileClick = () => {
        playClick();
        navigate('/profile');
    };

    const toggleUpcoming = (subject) => {
        playClick();
        setExpandedUpcoming(prev => prev === subject ? null : subject);
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

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    // Scroll to section function
    const scrollToSection = (sectionId) => {
        playClick();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
                message: 'This score indicates areas that need significant attention.',
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
    const groupedUpcoming = groupBySubject(assessments.upcoming);
    const groupedCompleted = groupBySubject(assessments.completed);
    const groupedMissed = assessments.missed ? groupBySubject(assessments.missed) : {};

    // Calculate stats
    const totalTests = assessments.completed.length;
    const avgScore = totalTests > 0
        ? Math.round(assessments.completed.reduce((acc, test) => acc + test.percentage, 0) / totalTests)
        : 0;

    // Calculate strongest subject (subject with highest average score)
    const getStrongestSubject = () => {
        if (assessments.completed.length === 0) return { name: 'N/A', score: 0 };

        const subjectScores = {};
        assessments.completed.forEach(test => {
            if (!subjectScores[test.subject]) {
                subjectScores[test.subject] = { total: 0, count: 0 };
            }
            subjectScores[test.subject].total += test.percentage;
            subjectScores[test.subject].count += 1;
        });

        let strongest = { name: 'N/A', avgScore: 0 };
        Object.entries(subjectScores).forEach(([subject, data]) => {
            const avg = data.total / data.count;
            if (avg > strongest.avgScore) {
                strongest = { name: subject, avgScore: Math.round(avg) };
            }
        });

        return strongest;
    };

    const strongestSubject = getStrongestSubject();

    // Generate specialized activities
    const activities = [];

    // 1. Last Test Attended Details
    if (assessments.completed.length > 0) {
        // Sort by rawDate to likely find the most relevant one, or ideally by attempt date if available
        // Using rawDate (test schedule) as a proxy for now
        const lastAttended = [...assessments.completed].sort((a, b) => b.rawDate - a.rawDate)[0];
        const gradeInfo = getRecommendations(lastAttended);
        
        activities.push({
            type: 'test_completed',
            title: `Last Attended: ${lastAttended.title}`,
            description: `Score: ${Math.round(lastAttended.percentage)}% • Grade: ${gradeInfo.grade}`,
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
            title: `Recent Test Posted: ${recentPosted.title}`,
            description: `Scheduled for ${recentPosted.date} at ${recentPosted.startTime}`,
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
            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
            />

            {/* Breadcrumb Navigation */}
            <Breadcrumb />

            {/* Dashboard Header */}
            <header className="dashboard-header">
                <div className="header-left-section">
                    <HamburgerButton onClick={() => setSidebarOpen(true)} />
                    <h1>Student Dashboard</h1>
                </div>
                <div className="header-actions">
                    <div className="student-info clickable" onClick={handleProfileClick}>
                        <img src="https://via.placeholder.com/40" alt="Avatar" className="avatar" />
                        <span>John Doe</span>
                    </div>
                    <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
                </div>
            </header>

            {/* Enhanced Stats Grid - Now works as Tab Navigation */}
            <div className="enhanced-stats-grid">
                <div 
                    className={`enhanced-stat-card clickable ${activeTab === 'upcoming' ? 'tab-active' : ''}`} 
                    onClick={() => { playClick(); setActiveTab('upcoming'); }}
                >
                    <div className="stat-icon-wrapper primary"><BookIcon size={24} /></div>
                    <div className="stat-info">
                        <AnimatedCounter
                            end={assessments.upcoming.length}
                            className="stat-number"
                        />
                        <span className="stat-label">Upcoming Tests</span>
                    </div>
                </div>
                <div 
                    className={`enhanced-stat-card live clickable ${activeTab === 'live' ? 'tab-active' : ''}`} 
                    onClick={() => { playClick(); setActiveTab('live'); }}
                >
                    <div className="stat-icon-wrapper danger"><TargetIcon size={24} /></div>
                    <div className="stat-info">
                        <AnimatedCounter
                            end={assessments.live.length}
                            className="stat-number"
                        />
                        <span className="stat-label">Live Now</span>
                    </div>
                </div>
                <div 
                    className={`enhanced-stat-card clickable ${activeTab === 'completed' ? 'tab-active' : ''}`} 
                    onClick={() => { playClick(); setActiveTab('completed'); }}
                >
                    <div className="stat-icon-wrapper warning"><CheckCircleIcon size={24} /></div>
                    <div className="stat-info">
                        <AnimatedCounter
                            end={totalTests}
                            className="stat-number"
                        />
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
                <div className="enhanced-stat-card strongest-subject-card clickable" onClick={() => scrollToSection('performance-section')}>
                    <div className="stat-icon-wrapper star"><StarIcon size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-subject-name">{strongestSubject.name}</span>
                        <span className="stat-label">Strongest Field</span>
                    </div>
                </div>
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
                                        <div key={test.id} className="assessment-card live-card">
                                            <div className="card-header">
                                                <span className="subject-tag">{test.subject}</span>
                                                <span className="live-badge">LIVE</span>
                                            </div>
                                            <h3>{test.title}</h3>
                                            <p className="instructor">By {test.instructor}</p>
                                            <p className="test-timing">
                                                {test.isScheduled ? 'Scheduled:' : 'Posted:'} {test.date} at {test.startTime}
                                            </p>
                                            <p className="test-duration">Duration: {test.duration}</p>
                                            <button
                                                className="btn-start"
                                                onClick={() => handleStartTest(test)}
                                            >
                                                Start Test →
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
                            <CalendarView events={[...assessments.live, ...assessments.upcoming]} />
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
                                    <div key={test.id} className="assessment-card upcoming-card">
                                        <div className="card-header">
                                            <span className="subject-tag">{test.subject}</span>
                                            <span className="upcoming-badge" style={{ backgroundColor: '#FFC107', color: '#000' }}>UPCOMING</span>
                                        </div>
                                        <h3>{test.title}</h3>
                                        <p className="instructor">By {test.instructor}</p>
                                        <p className="test-timing">Scheduled: {test.date} at {test.startTime}</p>
                                        <p className="test-duration">Duration: {test.duration}</p>
                                        <button
                                            className="btn-start disabled"
                                            disabled
                                            style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#6c757d', border: 'none' }}
                                        >
                                            Starts {test.startTime}
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
                                                className={`topic-box completed ${expandedCompleted === subject ? 'active' : ''}`}
                                                onClick={() => toggleCompleted(subject)}
                                            >
                                                <span className="topic-name">{subject}</span>
                                                <span className="topic-count">{tests.length}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedCompleted && groupedCompleted[expandedCompleted] && (
                                        <div className="expanded-content">
                                            <div className="expanded-header">
                                                <h3>{expandedCompleted}</h3>
                                                <button className="btn-close" onClick={() => setExpandedCompleted(null)}>✕</button>
                                            </div>
                                            <div className="completed-list">
                                                {groupedCompleted[expandedCompleted].map((test) => (
                                                    <div key={test.id} className="completed-card">
                                                        <div className="completed-info">
                                                            <div className="completed-header">
                                                                <h4>{test.title}</h4>
                                                                <span className="status-badge completed">Completed</span>
                                                            </div>
                                                            <p className="completed-meta">
                                                                {test.instructor} • {test.date}
                                                            </p>
                                                        </div>
                                                        <div className="completed-actions">
                                                            <button
                                                                className="btn-view-summary"
                                                                onClick={(e) => handleViewFeedback(test, e)}
                                                            >
                                                                View Summary
                                                            </button>
                                                        </div>
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

                        {/* Missed Assessments - Topic Boxes */}
                        {assessments.missed && assessments.missed.length > 0 && (
                            <section className="assessment-section">
                                <h2 className="section-title missed-title">Missed Assessments</h2>
                                <div className="topic-boxes-grid">
                                    {Object.entries(groupedMissed).map(([subject, tests]) => (
                                        <div
                                            key={subject}
                                            className={`topic-box missed ${expandedMissed === subject ? 'active' : ''}`}
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
                                            <button className="btn-close" onClick={() => setExpandedMissed(null)}>✕</button>
                                        </div>
                                        <div className="assessment-grid">
                                            {groupedMissed[expandedMissed].map((test) => (
                                                <div key={test.id} className="assessment-card missed-card">
                                                    <div className="card-header">
                                                        <span className="subject-tag">{test.subject}</span>
                                                        <span className="status-badge missed">Missed</span>
                                                    </div>
                                                    <h3>{test.title}</h3>
                                                    <p className="instructor">By {test.instructor}</p>
                                                    <p className="scheduled-date">Was scheduled: {test.date}</p>
                                                    <p className="test-timing missed-timing">Was available: {test.startTime} - {test.endTime}</p>
                                                    <p className="test-duration">Duration: {test.duration}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Performance Graph - After Missed Assessments */}
                        <div id="performance-section">
                            <PerformanceGraph data={assessments.completed} />
                        </div>
                    </div>

                    {/* Right Column - Calendar and Activity */}
                    <div id="calendar-section" className="widget-column">
                        <CalendarView events={[...assessments.live, ...assessments.upcoming]} />
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
                        <button className="btn-close-modal" onClick={closeFeedback}>✕</button>

                        {/* Illustration Area */}
                        <div className="summary-illustration">
                            <div className={`illustration-icon ${getRecommendations(selectedTest).gradeClass}`}>
                                {getRecommendations(selectedTest).gradeClass === 'excellent' && '🎯'}
                                {getRecommendations(selectedTest).gradeClass === 'good' && '✨'}
                                {getRecommendations(selectedTest).gradeClass === 'average' && '📈'}
                                {getRecommendations(selectedTest).gradeClass === 'low' && '💪'}
                            </div>
                        </div>

                        {/* Key Heading */}
                        <div className="summary-header">
                            <h2>Assessment Complete</h2>
                            <p className="summary-title">{selectedTest.title}</p>
                            <span className={`summary-grade ${getRecommendations(selectedTest).gradeClass}`}>
                                {getRecommendations(selectedTest).grade}
                            </span>
                        </div>

                        {/* One-line Feedback */}
                        <div className="summary-feedback">
                            <p>{getRecommendations(selectedTest).message}</p>
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
