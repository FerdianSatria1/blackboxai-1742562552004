// Audio Settings
export const AUDIO_SETTINGS = {
    sampleRate: 48000,
    bufferSize: 1024,
    channels: 2
};

// Update interval for VU meters (in milliseconds)
export const METER_UPDATE_INTERVAL = 50;

// Default input channels
export const DEFAULT_CHANNELS = {
    inputs: [
        {
            id: 'microphone',
            name: 'Microphone',
            icon: 'microphone',
            volume: 75,
            muted: false
        },
        {
            id: 'game',
            name: 'Game',
            icon: 'gamepad',
            volume: 85,
            muted: false
        },
        {
            id: 'music',
            name: 'Music',
            icon: 'music',
            volume: 65,
            muted: false
        },
        {
            id: 'browser',
            name: 'Browser',
            icon: 'globe',
            volume: 70,
            muted: false
        }
    ],
    outputs: [
        {
            id: 'speakers',
            name: 'Speakers',
            icon: 'volume-up',
            volume: 100,
            muted: false
        },
        {
            id: 'headphones',
            name: 'Headphones',
            icon: 'headphones',
            volume: 100,
            muted: false
        },
        {
            id: 'stream',
            name: 'Stream',
            icon: 'broadcast-tower',
            volume: 100,
            muted: false
        },
        {
            id: 'chat',
            name: 'Chat',
            icon: 'comments',
            volume: 100,
            muted: false
        }
    ]
};

// Default routing matrix configuration
export const DEFAULT_ROUTING = {
    microphone: {
        speakers: true,
        headphones: true,
        stream: true,
        chat: true
    },
    game: {
        speakers: true,
        headphones: true,
        stream: true,
        chat: false
    },
    music: {
        speakers: true,
        headphones: true,
        stream: true,
        chat: false
    },
    browser: {
        speakers: true,
        headphones: true,
        stream: false,
        chat: false
    }
};

// Volume range settings
export const VOLUME_SETTINGS = {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 75
};

// Theme colors (matching Tailwind config)
export const THEME_COLORS = {
    goxlrBlue: '#00a2ff',
    goxlrPurple: '#7b61ff',
    goxlrRed: '#ff0044',
    panelBg: '#1a1a1a',
    darkBg: '#141414',
    darkerBg: '#0a0a0a'
};

// Local storage keys
export const STORAGE_KEYS = {
    routing: 'audio-mixer-routing',
    volumes: 'audio-mixer-volumes',
    muted: 'audio-mixer-muted',
    presets: 'audio-mixer-presets'
};