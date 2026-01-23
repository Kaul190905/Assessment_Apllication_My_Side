import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
    end,
    start = 0,
    duration = 1500,
    suffix = '',
    prefix = '',
    decimals = 0,
    className = ''
}) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);
    const frameRef = useRef(null);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = start;
        const endValue = end;

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            const currentValue = startValue + (endValue - startValue) * easedProgress;
            countRef.current = currentValue;
            setCount(currentValue);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [end, start, duration]);

    const displayValue = decimals > 0
        ? count.toFixed(decimals)
        : Math.round(count);

    return (
        <span className={`animated-counter ${className}`}>
            {prefix}{displayValue}{suffix}
        </span>
    );
};

// Progress Ring Component
export const ProgressRing = ({
    progress,
    size = 120,
    strokeWidth = 8,
    color = 'var(--primary)',
    backgroundColor = 'var(--border-light)',
    children
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const timer = setTimeout(() => {
            const progressOffset = circumference - (progress / 100) * circumference;
            setOffset(progressOffset);
        }, 100);
        return () => clearTimeout(timer);
    }, [progress, circumference]);

    return (
        <div className="progress-ring-container" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="progress-ring">
                {/* Background circle */}
                <circle
                    className="progress-ring-bg"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className="progress-ring-progress"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 1s ease-out'
                    }}
                />
            </svg>
            <div className="progress-ring-content">
                {children}
            </div>
        </div>
    );
};

export default AnimatedCounter;
