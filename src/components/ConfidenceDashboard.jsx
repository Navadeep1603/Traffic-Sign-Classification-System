import React, { useState, useEffect } from 'react';

export default function ConfidenceDashboard({ result, isDark }) {
    const [animatedConf, setAnimatedConf] = useState(0);

    useEffect(() => {
        if (result) {
            setAnimatedConf(0);
            const target = result.confidence;
            const duration = 1200;
            const start = performance.now();
            const animate = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setAnimatedConf(Math.round(target * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [result]);

    if (!result) {
        return (
            <div className="animate-slide-up space-y-6">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    <div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-navy'}`}>Confidence Dashboard</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Classify an image to see confidence metrics</p>
                    </div>
                </div>
                <div className={`rounded-2xl p-16 text-center ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="text-6xl mb-4">📊</div>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No classification data yet</p>
                </div>
            </div>
        );
    }

    const conf = animatedConf;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (conf / 100) * circumference;
    const color = conf >= 90 ? '#10B981' : conf >= 70 ? '#F59E0B' : '#EF4444';
    const tops = result.topPredictions || [
        { name: result.signName, confidence: result.confidence },
        { name: 'Unknown Sign', confidence: Math.max(5, result.confidence - 15) },
        { name: 'Other', confidence: Math.max(2, result.confidence - 30) },
    ];
    const dc = isDark;

    return (
        <div className="animate-slide-up space-y-6">
            <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Confidence Dashboard</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Detailed classification confidence analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Circular Progress */}
                <div className={`rounded-2xl p-8 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg flex flex-col items-center`}>
                    <h3 className={`font-semibold mb-6 ${dc ? 'text-gray-300' : 'text-gray-600'}`}>Overall Confidence</h3>
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke={dc ? '#374151' : '#E5E7EB'} strokeWidth="8" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
                                strokeDasharray={circumference} strokeDashoffset={offset}
                                strokeLinecap="round" className="transition-all duration-300" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold" style={{ color }}>{conf}%</span>
                            <span className={`text-xs ${dc ? 'text-gray-400' : 'text-gray-500'}`}>confidence</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className={`font-semibold text-lg ${dc ? 'text-white' : 'text-gray-800'}`}>{result.signName}</p>
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white mt-2 inline-block" style={{ backgroundColor: color }}>
                            {conf >= 90 ? 'HIGH' : conf >= 70 ? 'MEDIUM' : 'LOW'} CONFIDENCE
                        </span>
                    </div>
                </div>

                {/* Top Predictions */}
                <div className={`rounded-2xl p-8 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <h3 className={`font-semibold mb-6 ${dc ? 'text-gray-300' : 'text-gray-600'}`}>Top Predictions</h3>
                    <div className="space-y-5">
                        {tops.map((p, i) => {
                            const barColor = i === 0 ? '#4A90E2' : i === 1 ? '#8B5CF6' : '#F59E0B';
                            return (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <span className={`text-sm font-medium ${dc ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {p.name}
                                        </span>
                                        <span className="text-sm font-bold" style={{ color: barColor }}>{p.confidence}%</span>
                                    </div>
                                    <div className={`h-3 rounded-full overflow-hidden ${dc ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${p.confidence}%`, backgroundColor: barColor }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Distribution Chart */}
                    <div className="mt-8">
                        <h4 className={`text-sm font-semibold mb-4 ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Confidence Distribution</h4>
                        <svg viewBox="0 0 300 100" className="w-full">
                            {tops.map((p, i) => {
                                const barColor = i === 0 ? '#4A90E2' : i === 1 ? '#8B5CF6' : '#F59E0B';
                                const barWidth = 70;
                                const x = i * 100 + 15;
                                const barHeight = p.confidence * 0.8;
                                return (
                                    <g key={i}>
                                        <rect x={x} y={80 - barHeight} width={barWidth} height={barHeight} rx="4" fill={barColor} opacity="0.8" />
                                        <text x={x + barWidth / 2} y={95} textAnchor="middle" fontSize="8" fill={dc ? '#9CA3AF' : '#6B7280'}>
                                            {p.name.substring(0, 10)}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
