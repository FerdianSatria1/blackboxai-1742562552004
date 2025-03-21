import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import MixerChannel from './components/MixerChannel';
import RoutingMatrix from './components/RoutingMatrix';
import { DEFAULT_CHANNELS } from './utils/constants';
import AudioEngine from './audio/AudioEngine';
import './styles/input.css';

const App = () => {
    const [channels, setChannels] = useState(DEFAULT_CHANNELS.inputs);
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [levels, setLevels] = useState({});

    useEffect(() => {
        initializeAudio();
        return () => {
            AudioEngine.cleanup();
        };
    }, []);

    const initializeAudio = async () => {
        try {
            // Initialize audio engine with mock inputs
            const initialized = await AudioEngine.initialize();
            if (!initialized) {
                throw new Error('Failed to initialize audio system');
            }

            // Start level monitoring
            AudioEngine.onMeterUpdate(levels => {
                setLevels(levels);
            });

            setAudioInitialized(true);
            setError(null);
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            setError('Failed to initialize audio system. Please try again.');
        }
    };

    const handleVolumeChange = (channelId, volume) => {
        setChannels(prev => prev.map(channel => 
            channel.id === channelId ? { ...channel, volume } : channel
        ));
        AudioEngine.setInputVolume(channelId, volume);
    };

    const handleMute = (channelId) => {
        setChannels(prev => {
            const newChannels = prev.map(channel => 
                channel.id === channelId ? { ...channel, muted: !channel.muted } : channel
            );
            AudioEngine.setInputMute(channelId, newChannels.find(c => c.id === channelId).muted);
            return newChannels;
        });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-darker-bg flex items-center justify-center p-4">
                <div className="bg-panel-bg rounded-xl p-8 max-w-md text-center">
                    <i className="fas fa-exclamation-triangle text-4xl text-goxlr-red mb-4"></i>
                    <h2 className="text-xl font-orbitron text-white mb-4">Audio System Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={initializeAudio}
                        className="mixer-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darker-bg p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-orbitron text-goxlr-blue">
                        Audio Mixer PC
                    </h1>
                    <p className="text-gray-400 font-rajdhani mt-2">
                        {audioInitialized ? (
                            <span className="flex items-center gap-2">
                                <i className="fas fa-check-circle text-green-500"></i>
                                Audio system initialized
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <i className="fas fa-circle-notch fa-spin text-goxlr-blue"></i>
                                Initializing audio system...
                            </span>
                        )}
                    </p>
                </header>

                {/* Main Content */}
                <main className="grid gap-8">
                    {/* Mixer Channels */}
                    <section>
                        <h2 className="text-2xl font-orbitron text-goxlr-purple mb-4">
                            Mixer Channels
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {channels.map(channel => (
                                <MixerChannel
                                    key={channel.id}
                                    channel={channel}
                                    level={levels[channel.id] || 0}
                                    onVolumeChange={handleVolumeChange}
                                    onMute={handleMute}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Routing Matrix */}
                    <section>
                        <h2 className="text-2xl font-orbitron text-goxlr-purple mb-4">
                            Routing Matrix
                        </h2>
                        <RoutingMatrix channels={channels} />
                    </section>
                </main>

                {/* Footer */}
                <footer className="mt-8 text-center text-gray-400">
                    <p className="font-rajdhani">
                        Built with React, Tailwind CSS, and Web Audio API
                    </p>
                </footer>
            </div>
        </div>
    );
};

// Create root and render
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);