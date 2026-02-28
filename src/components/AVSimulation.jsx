import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROAD_SIGNS = [
    { y: 80, name: 'Speed Limit 50', type: 'speed', color: '#EF4444' },
    { y: 200, name: 'Yield', type: 'danger', color: '#F59E0B' },
    { y: 320, name: 'Stop', type: 'prohibition', color: '#EF4444' },
    { y: 440, name: 'No Entry', type: 'prohibition', color: '#EF4444' },
    { y: 560, name: 'Pedestrian Crossing', type: 'danger', color: '#F59E0B' },
    { y: 680, name: 'Road Work', type: 'danger', color: '#F59E0B' },
    { y: 800, name: 'Keep Right', type: 'mandatory', color: '#3B82F6' },
    { y: 920, name: 'Roundabout', type: 'mandatory', color: '#3B82F6' },
];

export default function AVSimulation({ isDark }) {
    const [running, setRunning] = useState(false);
    const [carY, setCarY] = useState(0);
    const [speed, setSpeed] = useState(2);
    const [paused, setPaused] = useState(false);
    const [activeSign, setActiveSign] = useState(null);
    const [passedSigns, setPassedSigns] = useState([]);
    const animRef = useRef(null);
    const totalRoad = 1000;

    const reset = useCallback(() => {
        setCarY(0);
        setPassedSigns([]);
        setActiveSign(null);
        setPaused(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, []);

    const startSim = useCallback(() => {
        reset();
        setRunning(true);
    }, [reset]);

    useEffect(() => {
        if (!running || paused) return;
        let lastTime = performance.now();
        const animate = (now) => {
            const delta = (now - lastTime) / 16;
            lastTime = now;
            setCarY(prev => {
                const next = prev + speed * delta;
                if (next >= totalRoad) {
                    setRunning(false);
                    return totalRoad;
                }
                const hitSign = ROAD_SIGNS.find(s => !passedSigns.includes(s.name) && Math.abs(next - s.y) < 15);
                if (hitSign) {
                    setPaused(true);
                    setActiveSign(hitSign);
                    setPassedSigns(p => [...p, hitSign.name]);
                    setTimeout(() => {
                        setActiveSign(null);
                        setPaused(false);
                    }, 2000 / speed);
                    return next;
                }
                return next;
            });
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [running, paused, speed, passedSigns]);

    const dc = isDark;
    const viewBoxHeight = 500;
    const visibleStart = Math.max(0, carY - viewBoxHeight / 2);

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🏎️</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Autonomous Vehicle Simulation</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Demonstrating ADAS traffic sign detection integration</p>
                </div>
            </div>

            {/* Controls */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={running ? () => { setRunning(false); reset(); } : startSim}
                        className={`px-6 py-3 font-semibold rounded-xl transition-all ${running
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30'}`}>
                        {running ? '⏹ Stop Simulation' : '▶ Start Simulation'}
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <span className={`text-sm font-medium ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Speed:</span>
                        <input type="range" min="1" max="5" step="0.5" value={speed}
                            onChange={e => setSpeed(parseFloat(e.target.value))}
                            className="flex-1 accent-electric" />
                        <span className={`text-sm font-bold ${dc ? 'text-white' : 'text-gray-800'}`}>{speed}x</span>
                    </div>
                    <div className={`text-sm font-medium ${dc ? 'text-gray-400' : 'text-gray-500'}`}>
                        Signs passed: <span className="text-electric font-bold">{passedSigns.length}/{ROAD_SIGNS.length}</span>
                    </div>
                </div>
            </div>

            {/* Active Sign Alert */}
            {activeSign && (
                <div className={`rounded-2xl p-5 border-2 animate-slide-up flex items-center gap-4 ${activeSign.type === 'prohibition' ? 'bg-red-500/10 border-red-500/40' :
                        activeSign.type === 'danger' ? 'bg-yellow-500/10 border-yellow-500/40' :
                            'bg-blue-500/10 border-blue-500/40'}`}>
                    <div className="text-4xl">🚨</div>
                    <div>
                        <p className={`font-bold text-lg ${dc ? 'text-white' : 'text-gray-800'}`}>Sign Detected: {activeSign.name}</p>
                        <p className={dc ? 'text-gray-300' : 'text-gray-600'}>ADAS system responding — applying appropriate driving behavior</p>
                    </div>
                </div>
            )}

            {/* Road Visualization */}
            <div className={`rounded-2xl overflow-hidden ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <svg viewBox={`0 ${visibleStart} 300 ${viewBoxHeight}`} className="w-full" style={{ maxHeight: '500px' }}>
                    {/* Road background */}
                    <rect x="0" y={visibleStart} width="300" height={viewBoxHeight} fill={dc ? '#1a1a2e' : '#e5e7eb'} />
                    {/* Road */}
                    <rect x="90" y="0" width="120" height={totalRoad + 100} fill="#374151" />
                    {/* Lane lines */}
                    {Array.from({ length: Math.ceil(totalRoad / 40) + 3 }).map((_, i) => (
                        <rect key={i} x="148" y={i * 40} width="4" height="20" fill="#FCD34D" rx="1" />
                    ))}
                    {/* Road edges */}
                    <rect x="88" y="0" width="3" height={totalRoad + 100} fill="#F3F4F6" />
                    <rect x="209" y="0" width="3" height={totalRoad + 100} fill="#F3F4F6" />

                    {/* Signs */}
                    {ROAD_SIGNS.map((sign, i) => {
                        const passed = passedSigns.includes(sign.name);
                        return (
                            <g key={i}>
                                {/* Sign post */}
                                <rect x="225" y={sign.y - 5} width="3" height="25" fill="#6B7280" />
                                {/* Sign */}
                                {sign.type === 'danger' ? (
                                    <polygon points={`240,${sign.y - 15} 260,${sign.y + 10} 220,${sign.y + 10}`}
                                        fill={passed ? '#6B7280' : sign.color} opacity={passed ? 0.4 : 1} />
                                ) : (
                                    <circle cx="240" cy={sign.y} r="14"
                                        fill={passed ? '#6B7280' : sign.color} opacity={passed ? 0.4 : 1} />
                                )}
                                <text x="240" y={sign.y + 4} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                                    {sign.type === 'speed' ? '50' : sign.name === 'Stop' ? 'STOP' : '!'}
                                </text>
                                {/* Label */}
                                <text x="270" y={sign.y + 4} fontSize="6" fill={dc ? '#9CA3AF' : '#6B7280'}>{sign.name}</text>
                            </g>
                        );
                    })}

                    {/* Car */}
                    <g transform={`translate(140, ${carY})`}>
                        <rect x="-12" y="-20" width="24" height="36" rx="6" fill="#4A90E2" stroke="#3B82F6" strokeWidth="1.5" />
                        <rect x="-8" y="-14" width="16" height="8" rx="2" fill="#93C5FD" opacity="0.7" />
                        <circle cx="-8" cy="18" r="4" fill="#1F2937" stroke="#4B5563" strokeWidth="1" />
                        <circle cx="8" cy="18" r="4" fill="#1F2937" stroke="#4B5563" strokeWidth="1" />
                        {/* Headlight glow */}
                        <ellipse cx="0" cy="-28" rx="10" ry="8" fill="#FCD34D" opacity="0.15" />
                    </g>
                </svg>
            </div>

            {/* ADAS Info */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`font-bold mb-3 ${dc ? 'text-white' : 'text-gray-800'}`}>ADAS Integration Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl ${dc ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                        <h4 className="font-bold text-blue-400 text-sm mb-1">📡 Detection</h4>
                        <p className={`text-xs ${dc ? 'text-gray-300' : 'text-gray-600'}`}>Camera captures frames → CNN classifies signs in real-time</p>
                    </div>
                    <div className={`p-4 rounded-xl ${dc ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                        <h4 className="font-bold text-purple-400 text-sm mb-1">🧠 Processing</h4>
                        <p className={`text-xs ${dc ? 'text-gray-300' : 'text-gray-600'}`}>GAN-augmented model ensures robust classification across conditions</p>
                    </div>
                    <div className={`p-4 rounded-xl ${dc ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                        <h4 className="font-bold text-green-400 text-sm mb-1">🚗 Response</h4>
                        <p className={`text-xs ${dc ? 'text-gray-300' : 'text-gray-600'}`}>ADAS applies driving rules — speed adjustment, yielding, stopping</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
