import React from 'react';
import { METRICS } from '../constants';

const CONFUSION_DATA = [
    [92, 2, 1, 0, 1, 0, 2, 1, 0, 1], [1, 94, 1, 1, 0, 1, 0, 1, 0, 1], [0, 1, 91, 2, 1, 1, 1, 1, 1, 1],
    [1, 0, 2, 93, 0, 1, 1, 0, 1, 1], [0, 1, 1, 0, 95, 1, 0, 1, 0, 1], [1, 0, 1, 1, 1, 90, 2, 1, 1, 2],
    [1, 1, 0, 1, 0, 2, 93, 1, 1, 0], [0, 1, 1, 0, 1, 1, 1, 94, 0, 1], [1, 0, 1, 1, 0, 1, 0, 0, 95, 1],
    [0, 1, 1, 1, 1, 2, 0, 1, 1, 92]
];
const CONFUSION_LABELS = ['SL20', 'SL30', 'SL50', 'Stop', 'Yield', 'NEntry', 'Work', 'Ped', 'Keep R', 'Round'];
const IMBALANCE = [
    { name: 'SL20', before: 210, after: 1800 }, { name: 'SL30', before: 2220, after: 2400 },
    { name: 'Stop', before: 780, after: 1900 }, { name: 'Yield', before: 1350, after: 2100 },
    { name: 'No Entry', before: 1110, after: 2000 }, { name: 'Priority', before: 2100, after: 2300 },
    { name: 'Caution', before: 1440, after: 2100 }, { name: 'Curve L', before: 240, after: 1850 },
    { name: 'Ped Cross', before: 630, after: 1950 }, { name: 'Road Work', before: 1500, after: 2200 },
];

export default function MetricsPanel({ isDark }) {
    const dc = isDark;
    const metricNames = ['accuracy', 'precision', 'recall', 'f1'];
    const metricLabels = ['Accuracy', 'Precision', 'Recall', 'F1 Score'];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
                <span className="text-3xl">📈</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Model Performance Metrics</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>CNN performance comparison: with vs without GAN augmentation</p>
                </div>
            </div>

            {/* Metrics Comparison */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`font-bold mb-6 ${dc ? 'text-white' : 'text-gray-800'}`}>Performance Comparison</h3>
                <div className="flex gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-400 inline-block"></span> Without GAN</span>
                    <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-emerald-400 inline-block"></span> With GAN</span>
                </div>
                <svg viewBox="0 0 500 200" className="w-full">
                    {metricNames.map((key, i) => {
                        const x = i * 120 + 30;
                        const h1 = METRICS.without[key] * 1.6;
                        const h2 = METRICS.with[key] * 1.6;
                        return (
                            <g key={key}>
                                <rect x={x} y={175 - h1} width="35" height={h1} rx="3" fill="#60A5FA" opacity="0.8" />
                                <rect x={x + 40} y={175 - h2} width="35" height={h2} rx="3" fill="#34D399" opacity="0.8" />
                                <text x={x + 37} y={193} textAnchor="middle" fontSize="10" fill={dc ? '#9CA3AF' : '#6B7280'}>{metricLabels[i]}</text>
                                <text x={x + 17} y={170 - h1} textAnchor="middle" fontSize="8" fill="#60A5FA">{METRICS.without[key]}%</text>
                                <text x={x + 57} y={170 - h2} textAnchor="middle" fontSize="8" fill="#34D399">{METRICS.with[key]}%</text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {metricNames.map((key, i) => (
                    <div key={key} className={`rounded-xl p-4 text-center ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <p className={`text-xs font-medium mb-1 ${dc ? 'text-gray-400' : 'text-gray-500'}`}>{metricLabels[i]}</p>
                        <p className="text-2xl font-bold text-emerald-400">{METRICS.with[key]}%</p>
                        <p className="text-xs text-emerald-400/70 mt-1">+{(METRICS.with[key] - METRICS.without[key]).toFixed(1)}% ↑</p>
                    </div>
                ))}
            </div>

            {/* Confusion Matrix */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`font-bold mb-4 ${dc ? 'text-white' : 'text-gray-800'}`}>Confusion Matrix (Top 10 Classes)</h3>
                <div className="overflow-x-auto">
                    <svg viewBox="0 0 380 380" className="w-full max-w-lg mx-auto">
                        {/* Labels */}
                        {CONFUSION_LABELS.map((l, i) => (
                            <g key={`label-${i}`}>
                                <text x={i * 30 + 90} y={55} textAnchor="middle" fontSize="7" fill={dc ? '#9CA3AF' : '#6B7280'} transform={`rotate(-45 ${i * 30 + 90} 55)`}>{l}</text>
                                <text x={55} y={i * 30 + 80} textAnchor="end" fontSize="7" fill={dc ? '#9CA3AF' : '#6B7280'}>{l}</text>
                            </g>
                        ))}
                        {/* Cells */}
                        {CONFUSION_DATA.map((row, ri) =>
                            row.map((val, ci) => {
                                const opac = val / 100;
                                const isDiag = ri === ci;
                                return (
                                    <g key={`${ri}-${ci}`}>
                                        <rect x={ci * 30 + 65} y={ri * 30 + 65} width="28" height="28" rx="3"
                                            fill={isDiag ? `rgba(16,185,129,${opac})` : `rgba(239,68,68,${Math.min(opac * 3, 1)})`} />
                                        <text x={ci * 30 + 79} y={ri * 30 + 83} textAnchor="middle" fontSize="7"
                                            fill={val > 50 ? 'white' : dc ? '#D1D5DB' : '#374151'}>{val}</text>
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>
            </div>

            {/* Class Imbalance */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`font-bold mb-4 ${dc ? 'text-white' : 'text-gray-800'}`}>Class Imbalance — Before vs After GAN Augmentation</h3>
                <div className="space-y-3">
                    {IMBALANCE.map((cls, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className={dc ? 'text-gray-300' : 'text-gray-600'}>{cls.name}</span>
                                <span className={dc ? 'text-gray-500' : 'text-gray-400'}>{cls.before} → {cls.after}</span>
                            </div>
                            <div className="flex gap-1 h-2.5">
                                <div className="rounded-l-full bg-blue-400/60" style={{ width: `${(cls.before / 2500) * 100}%` }} />
                                <div className="rounded-r-full bg-emerald-400" style={{ width: `${((cls.after - cls.before) / 2500) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-4 text-xs">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-400/60 inline-block"></span> Original Samples</span>
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-400 inline-block"></span> GAN-Augmented</span>
                </div>
            </div>
        </div>
    );
}
