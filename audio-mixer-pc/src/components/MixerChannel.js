import React, { useState, useEffect, useRef } from 'react';

const MixerChannel = ({ channel, onVolumeChange, onMute }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startVolume, setStartVolume] = useState(0);
    const sliderRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartY(e.clientY);
        setStartVolume(channel.volume);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const delta = startY - e.clientY;
        const newVolume = Math.min(100, Math.max(0, startVolume + (delta / 2)));
        onVolumeChange(channel.id, Math.round(newVolume));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, startY, startVolume]);

    return (
        <div className="bg-panel-bg rounded-xl p-6 shadow-lg transition-transform hover:scale-102">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-orbitron">{channel.name}</h3>
                <button
                    onClick={() => onMute(channel.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        channel.muted
                            ? 'bg-goxlr-red shadow-glow-red'
                            : 'bg-dark-bg hover:bg-goxlr-red/20'
                    }`}
                >
                    <i className={`fas fa-${channel.icon} ${
                        channel.muted ? 'text-white' : 'text-goxlr-red'
                    }`}></i>
                </button>
            </div>

            <div className="relative h-64 mb-4">
                {/* VU Meter Background */}
                <div className="absolute inset-0 bg-dark-bg rounded-lg overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-goxlr-blue/20 transition-all duration-100"
                         style={{ height: `${channel.volume}%` }}>
                    </div>
                </div>

                {/* Volume Slider */}
                <div
                    ref={sliderRef}
                    className="absolute inset-0 cursor-pointer"
                    onMouseDown={handleMouseDown}
                >
                    <div
                        className="absolute w-full h-2 bg-goxlr-blue/30 rounded-full transform -rotate-90 origin-left"
                        style={{
                            top: '50%',
                            left: '50%',
                            width: '200%',
                            transformOrigin: '0 50%'
                        }}
                    >
                        <div
                            className="absolute h-full bg-goxlr-blue rounded-full transition-all duration-100"
                            style={{ width: `${channel.volume}%` }}
                        ></div>
                    </div>
                </div>

                {/* Level Markers */}
                <div className="absolute inset-y-0 right-0 w-6 flex flex-col justify-between py-2 text-xs font-orbitron">
                    <span>0</span>
                    <span>-12</span>
                    <span>-24</span>
                    <span>-36</span>
                </div>
            </div>

            <div className="text-center font-orbitron text-2xl text-goxlr-blue">
                {channel.volume}%
            </div>
        </div>
    );
};

export default MixerChannel;