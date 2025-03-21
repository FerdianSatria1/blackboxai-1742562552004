const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        // Audio device management
        getAudioDevices: () => ipcRenderer.invoke('get-audio-devices'),
        
        // Audio routing
        setAudioRouting: (inputId, outputId, enabled) => 
            ipcRenderer.invoke('set-audio-routing', inputId, outputId, enabled),
        
        // Volume control
        setChannelVolume: (channelId, volume) => 
            ipcRenderer.invoke('set-channel-volume', channelId, volume),
        
        // Mute control
        setChannelMute: (channelId, muted) => 
            ipcRenderer.invoke('set-channel-mute', channelId, muted),
        
        // Preset management
        savePreset: (name, config) => 
            ipcRenderer.invoke('save-preset', name, config),
        loadPreset: (name) => 
            ipcRenderer.invoke('load-preset', name),
        getPresets: () => 
            ipcRenderer.invoke('get-presets'),
        
        // Event listeners
        onAudioLevels: (callback) => {
            ipcRenderer.on('audio-levels', (event, levels) => callback(levels));
        },
        
        onDeviceChange: (callback) => {
            ipcRenderer.on('device-change', (event, devices) => callback(devices));
        },
        
        onError: (callback) => {
            ipcRenderer.on('error', (event, error) => callback(error));
        }
    }
);

// Handle uncaught errors
window.addEventListener('error', (event) => {
    ipcRenderer.invoke('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? event.error.toString() : null
    });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    ipcRenderer.invoke('error', {
        message: 'Unhandled Promise Rejection',
        reason: event.reason ? event.reason.toString() : null
    });
});

// Log when preload script is loaded
console.log('Preload script loaded');