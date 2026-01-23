import { useCallback, useRef, useEffect } from 'react';

// Sound frequencies and patterns for Web Audio API
const SOUNDS = {
    click: { frequency: 800, duration: 50, type: 'sine' },
    success: { frequency: 523.25, duration: 150, type: 'sine', pattern: [1, 1.25, 1.5] },
    warning: { frequency: 440, duration: 200, type: 'triangle', pattern: [1, 1, 1] },
    error: { frequency: 200, duration: 300, type: 'sawtooth' },
    tick: { frequency: 1000, duration: 30, type: 'sine' },
    select: { frequency: 600, duration: 80, type: 'sine' }
};

const useSound = () => {
    const audioContextRef = useRef(null);
    const enabledRef = useRef(true);

    // Initialize audio context on first interaction
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    // Play a tone with the Web Audio API
    const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.1) => {
        try {
            const audioContext = initAudio();

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

            // Envelope for smooth sound
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }, [initAudio]);

    // Play a sound effect
    const playSound = useCallback((soundName) => {
        // Check if sounds are enabled
        const soundsEnabled = localStorage.getItem('soundEnabled') !== 'false';
        if (!soundsEnabled || !enabledRef.current) return;

        const sound = SOUNDS[soundName];
        if (!sound) return;

        if (sound.pattern) {
            // Play pattern (like success chime)
            sound.pattern.forEach((multiplier, index) => {
                setTimeout(() => {
                    playTone(
                        sound.frequency * multiplier,
                        sound.duration,
                        sound.type,
                        0.08
                    );
                }, index * 100);
            });
        } else {
            playTone(sound.frequency, sound.duration, sound.type);
        }

        // Trigger haptic feedback on supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }, [playTone]);

    // Enable/disable sounds
    const setEnabled = useCallback((enabled) => {
        enabledRef.current = enabled;
        localStorage.setItem('soundEnabled', enabled.toString());
    }, []);

    // Check if sounds are enabled
    const isEnabled = useCallback(() => {
        return localStorage.getItem('soundEnabled') !== 'false';
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return {
        playSound,
        playClick: () => playSound('click'),
        playSuccess: () => playSound('success'),
        playWarning: () => playSound('warning'),
        playError: () => playSound('error'),
        playTick: () => playSound('tick'),
        playSelect: () => playSound('select'),
        setEnabled,
        isEnabled
    };
};

export default useSound;
