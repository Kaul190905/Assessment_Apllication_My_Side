import React from 'react';
import { useTheme } from './ThemeProvider';

const AccentColorPicker = () => {
    const { accentColor, setAccentColor, accentColors } = useTheme();

    return (
        <div className="accent-color-picker">
            <h4>Accent Color</h4>
            <div className="color-options">
                {Object.entries(accentColors).map(([key, color]) => (
                    <button
                        key={key}
                        className={`color-option ${accentColor === key ? 'selected' : ''}`}
                        onClick={() => setAccentColor(key)}
                        style={{ '--option-color': color.primary }}
                        aria-label={`Select ${color.name} color`}
                        title={color.name}
                    >
                        <span
                            className="color-swatch"
                            style={{ backgroundColor: color.primary }}
                        />
                        {accentColor === key && (
                            <span className="color-check">✓</span>
                        )}
                    </button>
                ))}
            </div>
            <p className="color-name">{accentColors[accentColor]?.name}</p>
        </div>
    );
};

export default AccentColorPicker;
