import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Breadcrumb from '../components/Breadcrumb';
import AnimatedCounter, { ProgressRing } from '../components/AnimatedCounter';
import AccentColorPicker from '../components/AccentColorPicker';
import { ProfileSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import useSound from '../hooks/useSound';
import { BookIcon, TargetIcon, CheckCircleIcon, StarIcon } from '../components/Icons';
<<<<<<< HEAD
import { testService } from '../services/testService';

const Profile = ({ isDark, onThemeToggle, onLogout }) => {
=======

const Profile = ({ isDark, onThemeToggle, onLogout, assessments }) => {
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
    const navigate = useNavigate();
    const toast = useToast();
    const { playClick, playSuccess, isEnabled, setEnabled } = useSound();

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

<<<<<<< HEAD
    // Assessments state - fetch from backend or use defaults
    const [assessments, setAssessments] = useState({
        upcoming: [],
        live: [],
        completed: [],
        missed: []
    });

=======
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
    // Settings states
    const [soundEnabled, setSoundEnabled] = useState(isEnabled());
    const [glassmorphism, setGlassmorphism] = useState(() => {
        return localStorage.getItem('glassmorphism') === 'true';
    });

    useEffect(() => {
<<<<<<< HEAD
        fetchAssessmentData();
    }, []);

    const fetchAssessmentData = async () => {
        try {
            setIsLoading(true);
            
            // Check if user has auth token
            // Check if user has auth token
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('No auth token in Profile, but fetching public tests...');
            }
            
            // Fetch published tests (upcoming)
            const tests = await testService.getPublishedTests();
            const transformedTests = tests.map(test => ({
                id: test.testId,
                title: test.topic,
                subject: test.topic,
                percentage: 0 // Default for upcoming
            }));

            // Try to fetch completed attempts
            try {
                const allAttempts = await testService.getMyAttempts();
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const studentIdentifier = userData.email || 'STU2025001';
                
                const myAttempts = allAttempts.filter(a => a.studentId === studentIdentifier);
                
                // Create a set of completed test IDs
                const completedTestIds = new Set(myAttempts.map(a => {
                    if (typeof a.testId === 'object' && a.testId !== null) {
                        return a.testId.testId;
                    }
                    return a.testId;
                }));

                const liveTests = transformedTests.filter(t => !completedTestIds.has(t.id));
                const completedTests = transformedTests.filter(t => completedTestIds.has(t.id));

                setAssessments({
                    upcoming: [],
                    live: liveTests,
                    completed: myAttempts, // Profile usually displays the attempt objects for performance analysis
                    missed: []
                });
            } catch (err) {
                console.warn('Could not fetch attempts in Profile:', err.message);
                setAssessments({
                    upcoming: [],
                    live: transformedTests,
                    completed: [],
                    missed: []
                });
            }
        } catch (error) {
            console.error('Failed to fetch assessment data:', error);
            // Use default empty state
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

=======
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
    const handleLogout = () => {
        playClick();
        toast.info('Logging out...');
        setTimeout(() => {
            onLogout();
            navigate('/login');
        }, 500);
    };

    const handleSoundToggle = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        setEnabled(newValue);
        if (newValue) {
            playSuccess();
            toast.success('Sound effects enabled');
        } else {
            toast.info('Sound effects disabled');
        }
    };

    const handleGlassToggle = () => {
        const newValue = !glassmorphism;
        setGlassmorphism(newValue);
        localStorage.setItem('glassmorphism', newValue.toString());
        document.documentElement.setAttribute('data-glass', newValue ? 'true' : 'false');
        playClick();
        toast.success(newValue ? 'Glassmorphism enabled' : 'Glassmorphism disabled');
    };

    const studentInfo = {
        name: "John Doe",
        email: "john.doe@university.edu",
        rollNumber: "STU2025001",
        department: "Computer Science",
        semester: "6th Semester",
        batch: "2022-2026"
    };

    const totalTests = assessments.completed.length;
    const avgScore = totalTests > 0
        ? Math.round(assessments.completed.reduce((acc, test) => acc + test.percentage, 0) / totalTests)
        : 0;

    // Calculate strongest subject (field with highest average score)
    const getStrongestSubject = () => {
        if (assessments.completed.length === 0) return { name: 'N/A', avgScore: 0 };

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

    if (isLoading) {
        return (
            <div className="profile-page">
                <ProfileSkeleton />
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Profile Header */}
            <header className="dashboard-header">
                <div className="header-nav">
                    <button className="btn-back" onClick={() => { playClick(); navigate('/'); }}>
                        ← Back to Dashboard
                    </button>
                    <h1>My Profile</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-logout-small" onClick={handleLogout}>
                        Logout
                    </button>
                    <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
                </div>
            </header>

            {/* Profile Card */}
            <section className="profile-card">
                <div className="profile-avatar-section">
                    <img
                        src="https://via.placeholder.com/120"
                        alt="Profile"
                        className="profile-avatar-large"
                    />
                    <div className="profile-name-section">
                        <h2>{studentInfo.name}</h2>
                        <p className="profile-email">{studentInfo.email}</p>
                        <span className="profile-badge">{studentInfo.department}</span>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="profile-detail-item">
                        <span className="detail-label">Roll Number</span>
                        <span className="detail-value">{studentInfo.rollNumber}</span>
                    </div>
                    <div className="profile-detail-item">
                        <span className="detail-label">Semester</span>
                        <span className="detail-value">{studentInfo.semester}</span>
                    </div>
                    <div className="profile-detail-item">
                        <span className="detail-label">Batch</span>
                        <span className="detail-value">{studentInfo.batch}</span>
                    </div>
                </div>
            </section>

            {/* Assessment Overview with Animated Stats */}
            <section className="overview-section">
                <h2 className="section-title">Assessment Overview</h2>
                <div className="stats-grid">
                    <div className="stat-card-large">
                        <span className="stat-icon"><BookIcon size={24} /></span>
                        <div className="stat-content">
                            <AnimatedCounter
                                end={assessments.upcoming.length}
                                className="stat-number"
                            />
                            <span className="stat-label">Upcoming Tests</span>
                        </div>
                    </div>
                    <div className="stat-card-large live">
                        <span className="stat-icon"><TargetIcon size={24} /></span>
                        <div className="stat-content">
                            <AnimatedCounter
                                end={assessments.live.length}
                                className="stat-number"
                            />
                            <span className="stat-label">Live Now</span>
                        </div>
                    </div>
                    <div className="stat-card-large">
                        <span className="stat-icon"><CheckCircleIcon size={24} /></span>
                        <div className="stat-content">
                            <AnimatedCounter
                                end={assessments.completed.length}
                                className="stat-number"
                            />
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                    <div className="stat-card-large strongest">
                        <span className="stat-icon star"><StarIcon size={24} /></span>
                        <div className="stat-content">
                            <span className="stat-subject-name">{strongestSubject.name}</span>
                            <span className="stat-label">Strongest Field</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Settings Section */}
            <section className="settings-section">
                <h3>Preferences</h3>

                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Sound Effects</h4>
                        <p>Play sounds for actions like selecting options and submitting</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={handleSoundToggle}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Glassmorphism</h4>
                        <p>Enable blur effects for cards and panels</p>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={glassmorphism}
                            onChange={handleGlassToggle}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <AccentColorPicker />
            </section>
        </div>
    );
};

export default Profile;
