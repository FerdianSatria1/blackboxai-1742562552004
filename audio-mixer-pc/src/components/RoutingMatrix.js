import React, { useState, useEffect } from 'react';
import { DEFAULT_CHANNELS, DEFAULT_ROUTING } from '../utils/constants';
import AudioEngine from '../audio/AudioEngine';

const RoutingMatrix = ({ channels }) => {
    const [routing, setRouting] = useState(DEFAULT_ROUTING);
    const outputs = DEFAULT_CHANNELS.outputs;

    const toggleRoute = (inputId, outputId) => {
        setRouting(prev => {
            const newRouting = {
                ...prev,
                [inputId]: {
                    ...prev[inputId],
                    [outputId]: !prev[inputId][outputId]
                }
            };

            // Update audio engine routing
            AudioEngine.updateRouting(
                inputId,
                outputId,
                newRouting[inputId][outputId]
            );

            return newRouting;
        });
    };

    return (
        <div className="bg-panel-bg rounded-xl p-6 shadow-lg overflow-x-auto">
            <div className="min-w-max">
                <div className="grid gap-4" style={{ 
                    gridTemplateColumns: `minmax(150px, auto) repeat(${outputs.length}, minmax(100px, 1fr))`
                }}>
                    {/* Header */}
                    <div className="font-orbitron text-goxlr-purple">Sources</div>
                    {outputs.map(output => (
                        <div key={output.id} className="text-center">
                            <div className="flex flex-col items-center gap-2 font-orbitron text-goxlr-blue">
                                <i className={`fas fa-${output.icon} text-xl`}></i>
                                <span>{output.name}</span>
                            </div>
                        </div>
                    ))}

                    {/* Routing Grid */}
                    {channels.map(input => (
                        <React.Fragment key={input.id}>
                            <div className="flex items-center gap-3 font-orbitron">
                                <i className={`fas fa-${input.icon} text-goxlr-purple`}></i>
                                <span>{input.name}</span>
                            </div>
                            {outputs.map(output => (
                                <div key={`${input.id}-${output.id}`} className="flex justify-center">
                                    <button
                                        onClick={() => toggleRoute(input.id, output.id)}
                                        className={`w-12 h-12 rounded-lg transition-all transform hover:scale-105 ${
                                            routing[input.id]?.[output.id]
                                                ? 'bg-goxlr-blue shadow-glow-blue'
                                                : 'bg-dark-bg hover:bg-goxlr-blue/20'
                                        }`}
                                        title={`Route ${input.name} to ${output.name}`}
                                    >
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <i className={`fas fa-link transform transition-all ${
                                                routing[input.id]?.[output.id]
                                                    ? 'text-white scale-110'
                                                    : 'text-goxlr-blue/50 scale-100'
                                            }`}></i>
                                            
                                            {/* Active route indicator */}
                                            {routing[input.id]?.[output.id] && (
                                                <div className="absolute inset-0 bg-goxlr-blue/20 rounded-lg animate-pulse"></div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm font-rajdhani">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-goxlr-blue rounded shadow-glow-blue"></div>
                    <span>Active Route</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-dark-bg rounded"></div>
                    <span>Inactive Route</span>
                </div>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-center text-sm text-gray-400 font-rajdhani">
                Click on a connection point to toggle routing between inputs and outputs
            </div>
        </div>
    );
};

export default RoutingMatrix;