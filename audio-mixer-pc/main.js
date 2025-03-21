const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Force headless mode for web environment
process.env.ELECTRON_DISABLE_GPU = '1';
app.disableHardwareAcceleration();

// Set required switches for web environment
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('headless');
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('no-zygote');
app.commandLine.appendSwitch('single-process');

let mainWindow;
let audioLevelsInterval;

async function createWindow() {
    const options = {
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            devTools: process.env.NODE_ENV === 'development'
        }
    };

    // Add headless-specific options
    if (process.env.NODE_ENV === 'development') {
        Object.assign(options, {
            frame: false,
            x: 0,
            y: 0,
            backgroundColor: '#ffffff',
        });
    }

    mainWindow = new BrowserWindow(options);

    try {
        // In development, load from webpack dev server
        if (process.env.NODE_ENV === 'development') {
            await mainWindow.loadURL('http://localhost:3000');
            console.log('Loaded development URL');
        } else {
            await mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
            console.log('Loaded production file');
        }

        // Start sending audio levels to renderer
        startAudioLevelsMonitoring();

        mainWindow.on('closed', () => {
            stopAudioLevelsMonitoring();
            mainWindow = null;
        });

        console.log('Window created successfully');
    } catch (error) {
        console.error('Error loading window:', error);
    }
}

// Audio levels monitoring
function startAudioLevelsMonitoring() {
    if (audioLevelsInterval) return;

    audioLevelsInterval = setInterval(() => {
        if (mainWindow) {
            // Send dummy audio levels for now
            mainWindow.webContents.send('audio-levels', {
                microphone: Math.random() * 100,
                game: Math.random() * 100,
                music: Math.random() * 100,
                browser: Math.random() * 100
            });
        }
    }, 50); // Update every 50ms
}

function stopAudioLevelsMonitoring() {
    if (audioLevelsInterval) {
        clearInterval(audioLevelsInterval);
        audioLevelsInterval = null;
    }
}

// Handle app ready
app.whenReady().then(() => {
    console.log('App is ready');
    createWindow().catch(console.error);
});

// Handle all windows closed
app.on('window-all-closed', () => {
    console.log('All windows closed');
    stopAudioLevelsMonitoring();
    app.quit();
});

// IPC Handlers
ipcMain.handle('get-audio-devices', async () => {
    console.log('Getting audio devices');
    return {
        inputs: [
            { id: 'microphone', name: 'Default Microphone' },
            { id: 'game', name: 'Game Audio' },
            { id: 'music', name: 'Music Player' },
            { id: 'browser', name: 'Browser Audio' }
        ],
        outputs: [
            { id: 'speakers', name: 'Speakers' },
            { id: 'headphones', name: 'Headphones' },
            { id: 'stream', name: 'Stream Output' },
            { id: 'chat', name: 'Chat Output' }
        ]
    };
});

ipcMain.handle('set-audio-routing', async (event, inputId, outputId, enabled) => {
    console.log(`Setting routing: ${inputId} -> ${outputId} = ${enabled}`);
    return true;
});

ipcMain.handle('set-channel-volume', async (event, channelId, volume) => {
    console.log(`Setting volume for ${channelId}: ${volume}%`);
    return true;
});

ipcMain.handle('set-channel-mute', async (event, channelId, muted) => {
    console.log(`Setting mute for ${channelId}: ${muted}`);
    return true;
});

ipcMain.handle('save-preset', async (event, name, config) => {
    console.log(`Saving preset "${name}":`, config);
    return true;
});

ipcMain.handle('load-preset', async (event, name) => {
    console.log(`Loading preset "${name}"`);
    return {
        routing: {},
        volumes: {},
        muted: {}
    };
});

ipcMain.handle('get-presets', async () => {
    console.log('Getting presets');
    return [
        { name: 'Default', id: 'default' },
        { name: 'Gaming', id: 'gaming' },
        { name: 'Streaming', id: 'streaming' }
    ];
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});