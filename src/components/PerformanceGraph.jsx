import React from 'react';

const PerformanceGraph = ({ data, title = "Performance Overview" }) => {
    return (
        <div className="performance-graph">
            <div className="graph-header">
                <h3>{title}</h3>
                <div className="graph-stats">
                    <div className="graph-stat">
                        <span className="stat-value">{data.length}</span>
                        <span className="stat-label">Assessments</span>
                    </div>
                </div>
            </div>

            <div className="graph-container">
                {/* Y-axis labels */}
                <div className="graph-y-axis">
                    <span>High</span>
                    <span></span>
                    <span>Mid</span>
                    <span></span>
                    <span>Low</span>
                </div>

                {/* Graph area */}
                <div className="graph-area">
                    {/* Grid lines */}
                    <div className="graph-grid">
                        <div className="grid-line" style={{ bottom: '100%' }} />
                        <div className="grid-line" style={{ bottom: '75%' }} />
                        <div className="grid-line" style={{ bottom: '50%' }} />
                        <div className="grid-line" style={{ bottom: '25%' }} />
                        <div className="grid-line" style={{ bottom: '0%' }} />
                    </div>

                    {/* Empty placeholder bars */}
                    <div className="graph-bars">
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <div key={index} className="bar-container">
                                    <div
                                        className="bar bar-placeholder"
                                        style={{
                                            height: '0%',
                                            backgroundColor: 'var(--primary-light)',
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="bar-tooltip">
                                            <strong>{item.title}</strong>
                                            <span className="tooltip-date">{item.date}</span>
                                        </div>
                                    </div>
                                    <span className="bar-label">{item.subject?.substring(0, 3) || `T${index + 1}`}</span>
                                </div>
                            ))
                        ) : (
                            <div className="graph-empty-message">
                                No assessment data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty state message */}
            <div className="graph-message">
                <p>Performance data will be updated soon</p>
            </div>
        </div>
    );
};

export default PerformanceGraph;
