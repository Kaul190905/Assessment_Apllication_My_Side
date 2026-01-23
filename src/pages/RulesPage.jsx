import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { ClipboardIcon } from '../components/Icons';

const RulesPage = ({ isDark, onThemeToggle, currentTest, onConfirmStart }) => {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(false);

    const handleAgreeChange = (e) => {
        setAgreed(e.target.checked);
        if (error) setError(false);
    };

    const handleStartTest = () => {
        if (agreed) {
            onConfirmStart();
            navigate('/test');
        } else {
            setError(true);
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    const rules = [
        "This is a timed examination. The timer will start as soon as you begin the test and cannot be paused.",
        "Do not refresh the page or navigate away during the test. This may result in loss of your answers.",
        "Each question carries equal marks. There is no negative marking for incorrect answers.",
        "You can navigate between questions using the navigation buttons or the question palette.",
        "You can mark questions for review and revisit them before final submission.",
        "Once submitted, you cannot modify your answers. Review all answers before submitting.",
        "The test will auto-submit when the time expires if not submitted manually.",
        "Ensure stable internet connectivity throughout the examination."
    ];

    return (
        <div className="rules-page">
            <header className="dashboard-header">
                <div className="header-nav">
                    <button className="btn-back" onClick={handleGoBack}>
                        ← Back to Dashboard
                    </button>
                    <h1>Test Instructions</h1>
                </div>
                <div className="header-actions">
                    <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
                </div>
            </header>

            {/* Test Info */}
            <div className="rules-container">
                <div className="test-info-card">
                    <h2>{currentTest?.title || 'Assessment'}</h2>
                    <span className="subject-tag">{currentTest?.subject}</span>
                </div>

                {/* Split Layout */}
                <div className="rules-split-layout">
                    {/* Left Side - Rules */}
                    <div className="rules-left-panel">
                        <div className="rules-card">
                            <h3>Examination Rules & Regulations</h3>
                            <div className="rules-list">
                                {rules.map((rule, index) => (
                                    <div key={index} className="rule-item">
                                        <span className="rule-number">{index + 1}</span>
                                        <p>{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className={`agreement-section ${error ? 'error' : ''}`}>
                            <label className="agreement-checkbox">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={handleAgreeChange}
                                />
                                <span className="checkmark"></span>
                                <span className="agreement-text">
                                    I have read and agree to all the rules and regulations mentioned above.
                                    I understand that any violation may result in disqualification.
                                </span>
                            </label>
                            {error && (
                                <p className="error-message">Please agree to the rules before starting the test.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Action Card */}
                    <div className="rules-right-panel">
                        <div className="action-card">
                            <div className="action-icon-box">
                                <ClipboardIcon size={32} />
                            </div>
                            <h3>Ready to Begin?</h3>
                            <p>Make sure you have read all the instructions and are ready to start.</p>
                            <div className="action-buttons-horizontal">
                                <button
                                    className="btn-start-test"
                                    onClick={handleStartTest}
                                    disabled={!agreed}
                                >
                                    Begin Test
                                </button>
                                <button
                                    className="btn-go-back"
                                    onClick={handleGoBack}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesPage;

