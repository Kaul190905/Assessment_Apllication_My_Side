import React, { useState, useEffect, useRef } from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import AccentColorPicker from '../components/AccentColorPicker';
import { ProfileSkeleton } from '../components/Skeleton';
import useSound from '../hooks/useSound';
import { BookIcon, TargetIcon, CheckCircleIcon, StarIcon, CameraIcon } from '../components/Icons';
import { testService } from '../services/testService';

const Profile = ({ isDark, onThemeToggle, onLogout }) => {
    const { playClick, playSuccess, isEnabled, setEnabled } = useSound();

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Assessments state - fetch from backend or use defaults
    const [assessments, setAssessments] = useState({
        upcoming: [],
        live: [],
        completed: [],
        missed: []
    });

    // Settings states
    const [soundEnabled, setSoundEnabled] = useState(isEnabled());
    const [glassmorphism, setGlassmorphism] = useState(() => {
        return localStorage.getItem('glassmorphism') === 'true';
    });
    const [profilePic, setProfilePic] = useState(() => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const identifier = userData.email || userData.id || 'guest';
            return localStorage.getItem(`profilePic_${identifier}`) || userData.profilePic || null;
        } catch (e) {
            return null;
        }
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchAssessmentData();
    }, []);

    const fetchAssessmentData = async () => {
        try {
            setIsLoading(true);

            // Check if user has auth token
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('No auth token in Profile, but fetching public tests...');
            }

            // Fetch published tests (upcoming/live)
            const tests = await testService.getPublishedTests();
            const transformedTests = tests.map(test => ({
                id: test.testId,
                title: test.topic,
                subject: test.topic,
                percentage: 0 // Default for upcoming
            }));

            // Try to fetch completed attempts
            try {
                let myAttempts = [];
                try {
                    const allAttempts = await testService.getMyAttempts();
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    const studentIdentifier = userData.email || userData.id;

                    if (!studentIdentifier) {
                        console.warn('No student identifier found in Profile');
                        return;
                    }

                    myAttempts = allAttempts.filter(a => {
                        const sId = (typeof a.studentId === 'object' && a.studentId !== null)
                            ? (a.studentId.email || a.studentId.id || a.studentId._id)
                            : a.studentId;
                        return sId === studentIdentifier;
                    });
                } catch (apiErr) {
                    console.warn('API attempts fetch failed in Profile:', apiErr.message);
                }

// Local fallback removed per user request

                // Create a set of completed test IDs
                const completedTestIds = new Set(myAttempts.map(a => {
                    if (typeof a.testId === 'object' && a.testId !== null) {
                        return a.testId.testId || a.testId._id || a.testId.id;
                    }
                    return a.testId;
                }));

                const liveTests = transformedTests.filter(t => !completedTestIds.has(t.id));
                const completedTests = transformedTests.filter(t => completedTestIds.has(t.id)).map(test => {
                    const attempt = myAttempts.find(a => {
                        const tId = (typeof a.testId === 'object' && a.testId !== null)
                            ? (a.testId.testId || a.testId._id || a.testId.id)
                            : a.testId;
                        return tId === test.id;
                    });
                    return {
                        ...test,
                        percentage: attempt ? attempt.percentage || (attempt.score ? (attempt.score / (test.marks || 1) * 100) : 0) : 0,
                        score: attempt ? attempt.score : 0,
                        attemptId: attempt ? attempt._id || attempt.id : null
                    };
                });

                setAssessments({
                    upcoming: [],
                    live: liveTests,
                    completed: completedTests,
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


    const handleSoundToggle = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        setEnabled(newValue);
        if (newValue) {
            playSuccess();
        }
    };

    const handleGlassToggle = () => {
        const newValue = !glassmorphism;
        setGlassmorphism(newValue);
        localStorage.setItem('glassmorphism', newValue.toString());
        document.documentElement.setAttribute('data-glass', newValue ? 'true' : 'false');
        playClick();
    };

    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfilePic(base64String);
                
                // Update localStorage with persistence
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const identifier = userData.email || userData.id;
                
                if (identifier) {
                    localStorage.setItem(`profilePic_${identifier}`, base64String);
                }
                
                userData.profilePic = base64String;
                localStorage.setItem('userData', JSON.stringify(userData));
                
                playSuccess();
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const studentInfo = (() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return {
            name: userData.name || "Student",
            email: userData.email || "",
            rollNumber: userData.rollNumber || userData.id || "",
            department: userData.department || "N/A",
            semester: userData.semester || "N/A",
            batch: userData.batch || "N/A"
        };
    })();

    // Calculate strongest subject (field with highest average score)

    // Calculate strongest subject (field with highest average score)
    const getStrongestSubject = () => {
        if (assessments.completed.length === 0) return { name: 'N/A', avgScore: 0 };

        const subjectScores = {};
        assessments.completed.forEach(test => {
            const subject = test.testId?.topic || test.subject || 'Unknown';
            if (!subjectScores[subject]) {
                subjectScores[subject] = { total: 0, count: 0 };
            }
            subjectScores[subject].total += (test.percentage || 0);
            subjectScores[subject].count += 1;
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
            {/* Profile Card */}

            {/* Profile Card */}
            <section className="profile-card">
                <div className="profile-avatar-section">
                    <div className="avatar-upload-wrapper" onClick={triggerFileInput}>
                        <img
                            src={profilePic || "https://via.placeholder.com/120"}
                            alt="Profile"
                            className="profile-avatar-large"
                        />
                        <div className="avatar-upload-overlay">
                            <CameraIcon size={24} color="white" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfilePicUpload}
                            accept="image/*"
                            className="hidden-input"
                        />
                    </div>
                    <div className="profile-name-section">
                        <h2 style={{ fontFamily: 'Inter', fontWeight: '700' }}>{studentInfo.name}</h2>
                        <p className="profile-email">{studentInfo.email}</p>
                        <span className="profile-badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>{studentInfo.department}</span>
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
            <section className="overview-section" style={{ marginBottom: '32px' }}>
                <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px', fontFamily: 'Inter', color: 'var(--text)' }}>Assessment Overview</h2>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <div className="stat-card-large" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookIcon size={24} />
                        </div>
                        <div className="stat-content">
                            <AnimatedCounter
                                end={assessments.upcoming.length}
                                className="stat-number"
                                style={{ fontSize: '1.5rem', fontWeight: '700' }}
                            />
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upcoming</span>
                        </div>
                    </div>
                    <div className="stat-card-large" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TargetIcon size={24} />
                        </div>
                        <div className="stat-content">
                            <AnimatedCounter
                                end={assessments.live.length}
                                className="stat-number"
                                style={{ fontSize: '1.5rem', fontWeight: '700' }}
                            />
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live Now</span>
                        </div>
                    </div>
                    <div className="stat-card-large" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircleIcon size={24} />
                        </div>
                        <div className="stat-content">
                            <AnimatedCounter
                                end={assessments.completed.length}
                                className="stat-number"
                                style={{ fontSize: '1.5rem', fontWeight: '700' }}
                            />
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed</span>
                        </div>
                    </div>
                    <div className="stat-card-large" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StarIcon size={24} />
                        </div>
                        <div className="stat-content" style={{ overflow: 'hidden' }}>
                            <span className="stat-subject-name" style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block', overflow: 'hidden' }}>{strongestSubject.name}</span>
                            <span className="stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Best Field</span>
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
