import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import OptionItem from '../components/OptionItem';
import NavigationButtons from '../components/NavigationButtons';
import QuestionPalette from '../components/QuestionPalette';
import SummaryLegend from '../components/SummaryLegend';
import SubmitButton from '../components/SubmitButton';
import useTestTimer from '../hooks/useTestTimer';
import useSound from '../hooks/useSound';
import { useToast } from '../components/Toast';
import { questions } from '../data/questions';
import { formatTime } from '../utils/formatTime';
<<<<<<< HEAD
import { testService } from '../services/testService';
=======
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a

const EXPECTED_ROLL = "STU2025001";

const TestPage = ({ isDark, onThemeToggle, currentTest, onCompleteTest }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const { playClick, playSelect, playSuccess, playWarning } = useSound();

<<<<<<< HEAD
    // Use questions from currentTest if available, ensuring it's an array
    const testQuestions = (currentTest?.questionsData && Array.isArray(currentTest.questionsData) && currentTest.questionsData.length > 0)
        ? currentTest.questionsData 
        : questions;

    const totalTime = currentTest?.duration ? parseInt(currentTest.duration) * 60 : 120 * 60;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(new Array(testQuestions.length).fill(null));
    const [marked, setMarked] = useState(new Array(testQuestions.length).fill(false));
    const [visited, setVisited] = useState(new Array(testQuestions.length).fill(false));
    const { timeLeft } = useTestTimer(totalTime);
=======
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
    const [marked, setMarked] = useState(new Array(questions.length).fill(false));
    const [visited, setVisited] = useState(new Array(questions.length).fill(false));
    const { timeLeft } = useTestTimer(120 * 60);
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a

    // Timer warning states
    const warned5Min = useRef(false);
    const warned1Min = useRef(false);
    const [timerPulse, setTimerPulse] = useState(false);

    // Submission flow states
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showRollInput, setShowRollInput] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [rollInput, setRollInput] = useState('');
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
<<<<<<< HEAD
    const [isSubmitting, setIsSubmitting] = useState(false);
=======
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a

    // Timer warnings
    useEffect(() => {
        if (timeLeft <= 300 && timeLeft > 60 && !warned5Min.current) {
            warned5Min.current = true;
            playWarning();
            toast.warning('5 minutes remaining!', 'Time Warning');
            setTimerPulse(true);
        }

        if (timeLeft <= 60 && !warned1Min.current) {
            warned1Min.current = true;
            playWarning();
            toast.error('1 minute remaining!', 'Time Critical');
            setTimerPulse(true);
        }

        // Remove pulse after animation
        if (timerPulse) {
            const timer = setTimeout(() => setTimerPulse(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, playWarning, toast, timerPulse]);

    useEffect(() => {
        const newVisited = [...visited];
        newVisited[currentQuestion] = true;
        setVisited(newVisited);
    }, [currentQuestion]);

    const handleAnswer = (index) => {
        playSelect();
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);
    };

    const handleClear = () => {
        playClick();
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = null;
        setAnswers(newAnswers);
        toast.info('Answer cleared');
    };

    const handleMark = () => {
        playClick();
        const newMarked = [...marked];
        const wasMarked = newMarked[currentQuestion];
        newMarked[currentQuestion] = !wasMarked;
        setMarked(newMarked);
        toast.info(wasMarked ? 'Removed from review' : 'Marked for review');
    };

    // Navigation with sound
    const handlePrev = () => {
        playClick();
        setCurrentQuestion(Math.max(0, currentQuestion - 1));
    };

    const handleNext = () => {
        playClick();
<<<<<<< HEAD
        setCurrentQuestion(Math.min(testQuestions.length - 1, currentQuestion + 1));
=======
        setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1));
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
    };

    const handleJump = (index) => {
        playClick();
        setCurrentQuestion(index);
    };

    // Step 1: Show fullscreen confirmation with question palette
    const handleSubmitClick = () => {
        playClick();
        setShowConfirmation(true);
    };

    // Step 2: User confirms, show roll number input
    const handleConfirmSubmit = () => {
        playClick();
        setShowConfirmation(false);
        setShowRollInput(true);
    };

<<<<<<< HEAD
    // Step 3: Validate roll number and submit to backend
    const handleFinalSubmit = async () => {
        if (rollInput.trim() === EXPECTED_ROLL) {
            setIsSubmitting(true);
            
            try {
                // Get user data
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const studentId = userData.email || rollInput;

                // Format answers for backend (Array of objects with option text)
                const formattedAnswers = answers.map((ansIdx, qIdx) => {
                    const question = testQuestions[qIdx];
                    // If skipped/null, we still map it but handle appropriately if needed
                    // For now, map only answered ones or map all?
                    // attemptController expects array matching logic.
                    // But usually we just filter out nulls or send them marked as such.
                    // Let's filter first then map
                    return ansIdx !== null ? {
                        questionId: question.id,
                        selected: question.options[ansIdx] // Send the Option Text
                    } : null;
                }).filter(a => a !== null);

                // Calculate time taken
                const timeTaken = totalTime - timeLeft;

                // Prepare attempt data
                const attemptData = {
                    studentId: studentId,
                    testId: currentTest?.id || 'demo-test',
                    answers: formattedAnswers,
                    timeTaken: timeTaken,
                };

                // Submit to backend
                const result = await testService.submitAttempt(attemptData);
                
                playSuccess();
                setShowRollInput(false);
                setShowSuccess(true);
                setSubmitted(true);

                toast.success('Test submitted successfully!');

                // Call onCompleteTest if provided
                if (onCompleteTest) {
                    const answeredCount = answers.filter(a => a !== null).length;
                    const totalMarks = currentTest?.marks || testQuestions.length * 2;
                    const calculatedScore = result.score || Math.min(answeredCount * 2, totalMarks);
                    onCompleteTest(calculatedScore, totalMarks);
                }

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);

            } catch (err) {
                console.error('Failed to submit test:', err);
                toast.error('Failed to submit test. Please try again.');
                setIsSubmitting(false);
                
                // Fallback: Still show success locally
                playSuccess();
                setShowRollInput(false);
                setShowSuccess(true);
                setSubmitted(true);

                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
=======
    // Step 3: Validate roll number and submit
    const handleFinalSubmit = () => {
        if (rollInput.trim() === EXPECTED_ROLL) {
            playSuccess();
            setShowRollInput(false);
            setShowSuccess(true);
            setSubmitted(true);

            // Calculate score (demo: random score based on answered questions)
            const answeredCount = answers.filter(a => a !== null).length;
            const totalMarks = currentTest?.marks || 40;
            // Simulate score: get 2 marks per answered question (simplified)
            const calculatedScore = Math.min(answeredCount * 2, totalMarks);

            // Call onCompleteTest to move from live to completed
            if (onCompleteTest) {
                onCompleteTest(calculatedScore, totalMarks);
            }

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
        } else {
            playWarning();
            setError(true);
            toast.error('Incorrect roll number');
        }
    };

    const handleCancelConfirmation = () => {
        playClick();
        setShowConfirmation(false);
    };

    const handleCancelRollInput = () => {
        playClick();
        setShowRollInput(false);
        setRollInput('');
        setError(false);
    };

    // Calculate statistics
    const answeredCount = answers.filter(a => a !== null).length;
    const markedCount = marked.filter(m => m).length;
    const notVisitedCount = visited.filter(v => !v).length;

    return (
        <>
            <Header
                timeLeft={timeLeft}
                formatTimeFn={formatTime}
                isDark={isDark}
                onThemeToggle={onThemeToggle}
                showTimer={true}
                timerPulse={timerPulse}
<<<<<<< HEAD
                title={currentTest?.title}
                instructor={currentTest?.instructor}
                duration={currentTest?.duration}
=======
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
            />

            {/* Progress Bar with Submit Button */}
            <div className="progress-submit-row">
<<<<<<< HEAD
                <ProgressBar answers={answers} total={testQuestions.length} />
=======
                <ProgressBar answers={answers} total={questions.length} />
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                <SubmitButton
                    onClick={handleSubmitClick}
                    disabled={submitted}
                    small={true}
                />
            </div>

            <div className="main-content">
                <section className="question-section">
<<<<<<< HEAD
                    <QuestionCard question={testQuestions[currentQuestion]} totalQuestions={testQuestions.length} />

                    <div className="options">
                        {testQuestions[currentQuestion].options.map((opt, i) => (
=======
                    <QuestionCard question={questions[currentQuestion]} />

                    <div className="options">
                        {questions[currentQuestion].options.map((opt, i) => (
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                            <OptionItem
                                key={i}
                                index={i}
                                text={opt}
                                selected={answers[currentQuestion] === i}
                                onSelect={handleAnswer}
                            />
                        ))}
                    </div>

                    <NavigationButtons
                        current={currentQuestion}
<<<<<<< HEAD
                        total={testQuestions.length}
=======
                        total={questions.length}
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onClear={handleClear}
                        onMark={handleMark}
                        marked={marked[currentQuestion]}
                        onSubmit={handleSubmitClick}
                    />
                </section>

                <aside className="sidebar">
                    <h3>Question Palette</h3>
                    <QuestionPalette
<<<<<<< HEAD
                        total={testQuestions.length}
=======
                        total={questions.length}
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                        current={currentQuestion}
                        answers={answers}
                        marked={marked}
                        visited={visited}
                        onJump={handleJump}
                    />

                    <SummaryLegend
                        answers={answers}
                        marked={marked}
                        visited={visited}
<<<<<<< HEAD
                        total={testQuestions.length}
=======
                        total={questions.length}
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                    />
                </aside>
            </div>

            {/* Fullscreen Confirmation Modal - Question Palette View */}
            {showConfirmation && (
                <div className="fullscreen-modal">
                    <div className="fullscreen-content">
                        <div className="confirmation-header">
                            <h2>Review Your Answers</h2>
                            <p>Please review the question status before submitting</p>
                        </div>

                        <div className="confirmation-stats">
                            <div className="stat-item answered">
                                <span className="stat-value">{answeredCount}</span>
                                <span className="stat-label">Answered</span>
                            </div>
                            <div className="stat-item marked">
                                <span className="stat-value">{markedCount}</span>
                                <span className="stat-label">Marked for Review</span>
                            </div>
                            <div className="stat-item not-answered">
<<<<<<< HEAD
                                <span className="stat-value">{testQuestions.length - answeredCount}</span>
=======
                                <span className="stat-value">{questions.length - answeredCount}</span>
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                                <span className="stat-label">Not Answered</span>
                            </div>
                            <div className="stat-item not-visited">
                                <span className="stat-value">{notVisitedCount}</span>
                                <span className="stat-label">Not Visited</span>
                            </div>
                        </div>

                        <div className="confirmation-palette">
                            <h3>Question Status</h3>
                            <div className="palette-grid-large">
<<<<<<< HEAD
                                {Array.from({ length: testQuestions.length }, (_, i) => {
=======
                                {Array.from({ length: questions.length }, (_, i) => {
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                                    let status = '';
                                    if (!visited[i]) status = 'not-visited';
                                    else if (marked[i]) status = 'marked';
                                    else if (answers[i] !== null) status = 'answered';
                                    else status = 'not-answered';

                                    return (
                                        <div
                                            key={i}
                                            className={`palette-item ${status}`}
                                            onClick={() => {
                                                playClick();
                                                setCurrentQuestion(i);
                                                setShowConfirmation(false);
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="confirmation-legend">
                            <div className="legend-item"><span className="dot answered"></span> Answered</div>
                            <div className="legend-item"><span className="dot marked"></span> Marked for Review</div>
                            <div className="legend-item"><span className="dot not-answered"></span> Not Answered</div>
                            <div className="legend-item"><span className="dot not-visited"></span> Not Visited</div>
                        </div>

                        <div className="confirmation-actions">
                            <button className="btn-back-to-test" onClick={handleCancelConfirmation}>
                                ← Back to Test
                            </button>
                            <button className="btn-confirm-submit" onClick={handleConfirmSubmit}>
                                Confirm & Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Roll Number Input Modal */}
            {showRollInput && (
                <div className="modal" onClick={handleCancelRollInput}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Verify Identity</h2>
                        <p>Enter your Roll Number to confirm submission:</p>
                        <input
                            type="text"
                            value={rollInput}
                            onChange={(e) => {
                                setRollInput(e.target.value);
                                if (error) setError(false);
                            }}
                            placeholder="e.g. STU2025001"
                            autoFocus
                        />
                        {error && (
                            <p className="error-text">
                                Incorrect Roll Number. Please try again.
                            </p>
                        )}
                        <div className="modal-buttons">
                            <button onClick={handleCancelRollInput}>Cancel</button>
                            <button onClick={handleFinalSubmit}>Submit Test</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Notification Modal */}
            {showSuccess && (
                <div className="success-modal">
                    <div className="success-content">
                        <div className="success-icon"></div>
                        <h2>Test Submitted Successfully!</h2>
<<<<<<< HEAD
                        <p>You answered <strong>{answeredCount}</strong> out of <strong>{testQuestions.length}</strong> questions.</p>
=======
                        <p>You answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.</p>
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                        <p className="redirect-text">Redirecting to Dashboard...</p>
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TestPage;
