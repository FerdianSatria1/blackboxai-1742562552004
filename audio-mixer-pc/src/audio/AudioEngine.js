import { AUDIO_SETTINGS, METER_UPDATE_INTERVAL } from '../utils/constants';
import { calculateRMS, rmsToDb, dbToLinear, clamp } from '../utils/helpers';

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.inputs = new Map();
        this.outputs = new Map();
        this.routing = new Map();
        this.meters = new Map();
        this.meterCallbacks = new Set();
        this.meterInterval = null;
        this.mockOscillators = new Map();
    }

    async initialize() {
        try {
            // Create audio context with suspended state
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: AUDIO_SETTINGS.sampleRate,
                latencyHint: 'interactive'
            });

            // Create mock inputs (for development/testing)
            await this.createMockInputs();

            // Create outputs
            this.createOutputs();

            // Start meter monitoring
            this.startMetering();

            // Resume audio context
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            return true;
        } catch (error) {
            console.error('Failed to initialize AudioEngine:', error);
            return false;
        }
    }

    async createMockInputs() {
        // Create mock inputs with oscillators
        const mockInputs = [
            { id: 'microphone', frequency: 440 }, // A4 note
            { id: 'game', frequency: 523.25 }, // C5 note
            { id: 'music', frequency: 659.25 }, // E5 note
            { id: 'browser', frequency: 783.99 } // G5 note
        ];

        for (const { id, frequency } of mockInputs) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const analyserNode = this.audioContext.createAnalyser();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
            
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.8;

            oscillator.connect(gainNode);
            gainNode.connect(analyserNode);

            this.inputs.set(id, {
                source: oscillator,
                gain: gainNode,
                analyser: analyserNode,
                volume: 75,
                muted: false
            });

            this.mockOscillators.set(id, oscillator);
            oscillator.start();
        }
    }

    createOutputs() {
        const outputIds = ['speakers', 'headphones', 'stream', 'chat'];

        for (const id of outputIds) {
            const gainNode = this.audioContext.createGain();
            const analyserNode = this.audioContext.createAnalyser();
            
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.8;

            gainNode.connect(analyserNode);
            analyserNode.connect(this.audioContext.destination);

            this.outputs.set(id, {
                gain: gainNode,
                analyser: analyserNode,
                volume: 100,
                muted: false
            });
        }
    }

    setInputVolume(id, volume) {
        const input = this.inputs.get(id);
        if (input) {
            const normalizedVolume = clamp(volume / 100, 0, 1);
            input.volume = volume;
            input.gain.gain.setValueAtTime(
                input.muted ? 0 : normalizedVolume,
                this.audioContext.currentTime
            );
        }
    }

    setOutputVolume(id, volume) {
        const output = this.outputs.get(id);
        if (output) {
            const normalizedVolume = clamp(volume / 100, 0, 1);
            output.volume = volume;
            output.gain.gain.setValueAtTime(
                output.muted ? 0 : normalizedVolume,
                this.audioContext.currentTime
            );
        }
    }

    setInputMute(id, muted) {
        const input = this.inputs.get(id);
        if (input) {
            input.muted = muted;
            const normalizedVolume = clamp(input.volume / 100, 0, 1);
            input.gain.gain.setValueAtTime(
                muted ? 0 : normalizedVolume,
                this.audioContext.currentTime
            );
        }
    }

    setOutputMute(id, muted) {
        const output = this.outputs.get(id);
        if (output) {
            output.muted = muted;
            const normalizedVolume = clamp(output.volume / 100, 0, 1);
            output.gain.gain.setValueAtTime(
                muted ? 0 : normalizedVolume,
                this.audioContext.currentTime
            );
        }
    }

    updateRouting(inputId, outputId, enabled) {
        const input = this.inputs.get(inputId);
        const output = this.outputs.get(outputId);

        if (!input || !output) return;

        const routingKey = `${inputId}-${outputId}`;
        const existingRoute = this.routing.get(routingKey);

        if (enabled && !existingRoute) {
            input.gain.connect(output.gain);
            this.routing.set(routingKey, true);
        } else if (!enabled && existingRoute) {
            input.gain.disconnect(output.gain);
            this.routing.delete(routingKey);
        }
    }

    startMetering() {
        if (this.meterInterval) return;

        this.meterInterval = setInterval(() => {
            const levels = {};

            // Process input levels with some randomization for visual feedback
            for (const [id, input] of this.inputs) {
                const analyser = input.analyser;
                const dataArray = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatTimeDomainData(dataArray);
                
                // Add some random variation for visual interest
                const baseLevel = input.muted ? 0 : (input.volume * 0.75);
                const randomVariation = Math.random() * 20;
                levels[id] = clamp(Math.round(baseLevel + randomVariation), 0, 100);
            }

            // Process output levels
            for (const [id, output] of this.outputs) {
                const analyser = output.analyser;
                const dataArray = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatTimeDomainData(dataArray);
                
                // Add some random variation for visual interest
                const baseLevel = output.muted ? 0 : (output.volume * 0.75);
                const randomVariation = Math.random() * 20;
                levels[id] = clamp(Math.round(baseLevel + randomVariation), 0, 100);
            }

            // Notify all callbacks
            this.meterCallbacks.forEach(callback => callback(levels));
        }, METER_UPDATE_INTERVAL);
    }

    stopMetering() {
        if (this.meterInterval) {
            clearInterval(this.meterInterval);
            this.meterInterval = null;
        }
    }

    onMeterUpdate(callback) {
        this.meterCallbacks.add(callback);
        return () => this.meterCallbacks.delete(callback);
    }

    async cleanup() {
        this.stopMetering();
        this.meterCallbacks.clear();
        
        // Stop all oscillators
        for (const oscillator of this.mockOscillators.values()) {
            oscillator.stop();
        }
        this.mockOscillators.clear();

        // Clear all connections
        this.routing.clear();
        this.inputs.clear();
        this.outputs.clear();

        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }
    }
}

export default new AudioEngine();