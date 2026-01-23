import React, { useState } from 'react';

const CalendarView = ({ events = [], onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and total days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get today's date for highlighting
    const today = new Date();
    const isToday = (day) => {
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    // Check if a day has events
    const getEventsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => {
            // Try to match various date formats
            const eventDate = event.date;
            if (!eventDate) return false;

            // Parse date strings like "Dec 28, 2025" or "2025-12-28"
            const eventDateObj = new Date(eventDate);
            if (!isNaN(eventDateObj)) {
                return eventDateObj.getDate() === day &&
                    eventDateObj.getMonth() === month &&
                    eventDateObj.getFullYear() === year;
            }
            return false;
        });
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDayClick = (day, dayEvents) => {
        if (dayEvents.length > 0) {
            const clickedDate = new Date(year, month, day);
            setSelectedDate(clickedDate);
            setSelectedEvents(dayEvents);
            if (onEventClick) {
                onEventClick(dayEvents);
            }
        }
    };

    const closePopup = () => {
        setSelectedDate(null);
        setSelectedEvents([]);
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return '';
        return `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    };

    // Generate calendar days
    const calendarDays = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEvents = getEventsForDay(day);
        const hasEvents = dayEvents.length > 0;
        const eventCount = dayEvents.length;

        calendarDays.push(
            <div
                key={day}
                className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
                onClick={() => handleDayClick(day, dayEvents)}
            >
                <span className="day-number">{day}</span>
                {hasEvents && (
                    <span className="event-count-badge">{eventCount}</span>
                )}
            </div>
        );
    }

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <button className="calendar-nav" onClick={prevMonth}>‹</button>
                <h3>{months[month]} {year}</h3>
                <button className="calendar-nav" onClick={nextMonth}>›</button>
            </div>

            <div className="calendar-weekdays">
                {daysOfWeek.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {calendarDays}
            </div>

            {/* Assessment Details Popup Modal */}
            {selectedDate && selectedEvents.length > 0 && (
                <div className="calendar-popup-overlay" onClick={closePopup}>
                    <div className="calendar-popup-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-header">
                            <h3>Assessments on {formatSelectedDate()}</h3>
                            <button className="popup-close-btn" onClick={closePopup}>✕</button>
                        </div>
                        <div className="popup-content">
                            {selectedEvents.map((event, index) => (
                                <div key={index} className="popup-assessment-card">
                                    <div className="popup-card-header">
                                        <span className="subject-tag">{event.subject}</span>
                                        <span className="status-badge upcoming">Upcoming</span>
                                    </div>
                                    <h4>{event.title}</h4>
                                    <p className="popup-instructor">By {event.instructor}</p>
                                    <div className="popup-details">
                                        <p className="popup-timing">
                                            <span className="detail-icon">🕐</span>
                                            {event.startTime} - {event.endTime}
                                        </p>
                                        <p className="popup-duration">
                                            <span className="detail-icon">⏱️</span>
                                            Duration: {event.duration}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;

