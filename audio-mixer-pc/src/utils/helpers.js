/**
 * Calculate RMS (Root Mean Square) value from audio samples
 * @param {Float32Array} samples Array of audio samples
 * @returns {number} RMS value
 */
export const calculateRMS = (samples) => {
    const sum = samples.reduce((acc, sample) => acc + (sample * sample), 0);
    return Math.sqrt(sum / samples.length);
};

/**
 * Convert RMS value to decibels
 * @param {number} rms RMS value
 * @returns {number} Decibel value
 */
export const rmsToDb = (rms) => {
    return 20 * Math.log10(Math.max(rms, 1e-6));
};

/**
 * Convert linear value to decibels
 * @param {number} value Linear value (0-1)
 * @returns {number} Decibel value
 */
export const linearToDb = (value) => {
    return 20 * Math.log10(Math.max(value / 100, 1e-6));
};

/**
 * Convert decibels to linear value
 * @param {number} db Decibel value
 * @returns {number} Linear value (0-1)
 */
export const dbToLinear = (db) => {
    return Math.pow(10, db / 20);
};

/**
 * Format decibel value for display
 * @param {number} db Decibel value
 * @returns {string} Formatted string
 */
export const formatDb = (db) => {
    if (db <= -60) return '-∞';
    return db.toFixed(1);
};

/**
 * Clamp a value between min and max
 * @param {number} value Value to clamp
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Scale a value from one range to another
 * @param {number} value Value to scale
 * @param {number} inMin Input range minimum
 * @param {number} inMax Input range maximum
 * @param {number} outMin Output range minimum
 * @param {number} outMax Output range maximum
 * @returns {number} Scaled value
 */
export const scale = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Smooth a value using exponential moving average
 * @param {number} currentValue Current value
 * @param {number} targetValue Target value
 * @param {number} smoothingFactor Smoothing factor (0-1)
 * @returns {number} Smoothed value
 */
export const smoothValue = (currentValue, targetValue, smoothingFactor = 0.5) => {
    return currentValue + (targetValue - currentValue) * smoothingFactor;
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Check if audio device is available
 * @returns {Promise<boolean>} True if audio device is available
 */
export const checkAudioAvailability = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.some(device => device.kind === 'audioinput');
    } catch (error) {
        console.error('Error checking audio availability:', error);
        return false;
    }
};

/**
 * Get audio device label or fallback name
 * @param {MediaDeviceInfo} device Audio device
 * @returns {string} Device label or fallback name
 */
export const getDeviceLabel = (device) => {
    return device.label || `Audio Device ${device.deviceId.slice(0, 4)}`;
};

/**
 * Create an audio meter gradient
 * @param {number} value Current value (0-100)
 * @returns {string} CSS gradient string
 */
export const createMeterGradient = (value) => {
    const colors = [
        { stop: 0, color: '#00a2ff' },    // Blue
        { stop: 70, color: '#7b61ff' },   // Purple
        { stop: 85, color: '#ff0044' }     // Red
    ];

    return `linear-gradient(to top, ${
        colors.map(({ stop, color }) => `${color} ${stop}%`).join(', ')
    })`;
};