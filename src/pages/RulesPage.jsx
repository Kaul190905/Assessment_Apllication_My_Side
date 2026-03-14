import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

            {/* Test Info */}
            <div className="rules-container">
                <div className="test-info-card" style={{ marginBottom: '24px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{currentTest?.title || 'Assessment'}</h2>
                    <span className="subject-tag" style={{ backgroundColor: 'var(--badge-subject-bg)', color: 'var(--badge-subject-text)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>{currentTest?.subject}</span>
                </div>

                {/* Split Layout */}
                <div className="rules-split-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    {/* Left Side - Rules */}
                    <div className="rules-left-panel">
                        <div className="rules-card" style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', fontWeight: '600', color: 'var(--text)' }}>Examination Rules & Regulations</h3>
                            <div className="rules-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {rules.map((rule, index) => (
                                    <div key={index} className="rule-item" style={{ display: 'flex', gap: '16px' }}>
                                        <span className="rule-number" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--badge-subject-bg)', color: 'var(--badge-subject-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: '700' }}>{index + 1}</span>
                                        <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className={`agreement-section ${error ? 'error' : ''}`} style={{ marginTop: '24px', padding: '16px 24px', borderRadius: '12px', background: error ? 'var(--badge-live-bg)' : 'var(--badge-subject-bg)', border: `1px solid ${error ? 'var(--badge-live-text)' : 'var(--badge-subject-text)'}` }}>
                            <label className="agreement-checkbox" style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={handleAgreeChange}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--badge-subject-text)', cursor: 'pointer' }}
                                />
                                <span className="agreement-text" style={{ fontSize: '0.9rem', color: error ? 'var(--badge-live-text)' : 'var(--badge-subject-text)', fontWeight: '500' }}>
                                    I have read and agree to all the rules and regulations mentioned above.
                                    I understand that any violation may result in disqualification.
                                </span>
                            </label>
                            {error && (
                                <p className="error-message" style={{ margin: '8px 0 0 32px', color: 'var(--badge-live-text)', fontSize: '0.8rem', fontWeight: '600' }}>Please agree to the rules before starting the test.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Action Card */}
                    <div className="rules-right-panel">
                        <div className="action-card" style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', textAlign: 'center' }}>
                            <div className="action-icon-box" style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--badge-subject-bg)', color: 'var(--badge-subject-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                                <ClipboardIcon size={32} />
                            </div>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600' }}>Ready to Begin?</h3>
                            <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Make sure you have read all the instructions and are ready to start.</p>
                            <div className="action-buttons-horizontal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    className="btn-start-test"
                                    onClick={handleStartTest}
                                    disabled={!agreed}
                                    style={{ padding: '14px', borderRadius: '12px', backgroundColor: agreed ? 'var(--primary)' : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: agreed ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease' }}
                                >
                                    Begin Test
                                </button>
                                <button
                                    className="btn-go-back"
                                    onClick={handleGoBack}
                                    style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                >
                                    Go Back
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

