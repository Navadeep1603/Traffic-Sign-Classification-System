import React, { useState, useCallback } from 'react';
import { GTSRB_CLASSES, SIGN_INFO } from '../constants';

const SIGN_SHAPES = {
    speed: { shape: 'circle', border: '#EF4444', inner: '#FFFFFF', symbol: '#000' },
    prohibition: { shape: 'circle', border: '#EF4444', inner: '#FFFFFF', symbol: '#000' },
    danger: { shape: 'triangle', border: '#EF4444', inner: '#FFFFFF', symbol: '#000' },
    mandatory: { shape: 'circle', border: '#3B82F6', inner: '#3B82F6', symbol: '#FFF' },
    other: { shape: 'rectangle', border: '#F59E0B', inner: '#F59E0B', symbol: '#000' },
};

function getSignType(name) {
    const n = name.toLowerCase();
    if (n.includes('speed') || n.includes('end speed')) return 'speed';
    if (n.includes('no ') || n.includes('stop') || n.includes('end ')) return 'prohibition';
    if (n.includes('curve') || n.includes('bumpy') || n.includes('slippery') || n.includes('narrow') || n.includes('caution') ||
        n.includes('crossing') || n.includes('ice') || n.includes('wild') || n.includes('road work') || n.includes('traffic signals')) return 'danger';
    if (n.includes('keep') || n.includes('turn') || n.includes('ahead') || n.includes('go ') || n.includes('roundabout')) return 'mandatory';
    return 'other';
}

function SignIcon({ name, size = 48 }) {
    const type = getSignType(name);
    const s = SIGN_SHAPES[type];
    if (s.shape === 'triangle') {
        return (
            <svg width={size} height={size} viewBox="0 0 50 50">
                <polygon points="25,5 45,42 5,42" fill={s.inner} stroke={s.border} strokeWidth="3" />
                <text x="25" y="35" textAnchor="middle" fontSize="10" fill={s.symbol} fontWeight="bold">!</text>
            </svg>
        );
    }
    if (s.shape === 'rectangle') {
        return (
            <svg width={size} height={size} viewBox="0 0 50 50">
                <rect x="5" y="5" width="40" height="40" rx="4" fill={s.inner} stroke={s.border} strokeWidth="3" />
                <text x="25" y="30" textAnchor="middle" fontSize="9" fill={s.symbol} fontWeight="bold">▶</text>
            </svg>
        );
    }
    return (
        <svg width={size} height={size} viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="22" fill={s.inner} stroke={s.border} strokeWidth="3" />
            <text x="25" y="30" textAnchor="middle" fontSize={type === 'speed' ? '10' : '14'} fill={s.symbol} fontWeight="bold">
                {type === 'speed' ? name.replace(/\D/g, '').slice(0, 3) : '—'}
            </text>
        </svg>
    );
}

export default function Encyclopedia({ isDark }) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const filtered = GTSRB_CLASSES.filter(s => s.toLowerCase().includes(search.toLowerCase()));

    const selectSign = useCallback((signName) => {
        setSelected(signName);
    }, []);

    const dc = isDark;
    const selectedInfo = selected ? SIGN_INFO[selected] : null;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
                <span className="text-3xl">ℹ️</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Sign Encyclopedia</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Complete reference for all 43 GTSRB traffic sign classes</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search traffic signs..."
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all border ${dc ? 'bg-gray-800 text-white border-gray-700 focus:border-electric' : 'bg-white text-gray-800 border-gray-200 focus:border-electric'}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sign List */}
                <div className={`rounded-2xl ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
                    <div className={`px-5 py-3 ${dc ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <p className={`text-sm font-semibold ${dc ? 'text-gray-300' : 'text-gray-600'}`}>{filtered.length} signs found</p>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        {filtered.map((s, i) => (
                            <button key={i} onClick={() => selectSign(s)}
                                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all border-b ${selected === s
                                        ? dc ? 'bg-electric/20 border-electric/30' : 'bg-electric/10 border-electric/20'
                                        : dc ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                                <SignIcon name={s} size={32} />
                                <div>
                                    <p className={`text-sm font-medium ${dc ? 'text-white' : 'text-gray-800'}`}>{s}</p>
                                    <p className={`text-xs ${dc ? 'text-gray-500' : 'text-gray-400'}`}>Class {GTSRB_CLASSES.indexOf(s)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    {!selected ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                            <div className="text-6xl mb-4">ℹ️</div>
                            <p className={dc ? 'text-gray-400' : 'text-gray-500'}>Select a sign to view details</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <SignIcon name={selected} size={56} />
                                <div>
                                    <h3 className={`text-xl font-bold ${dc ? 'text-white' : 'text-gray-800'}`}>{selected}</h3>
                                    <p className="text-sm text-electric">Class {GTSRB_CLASSES.indexOf(selected)} • {selectedInfo?.category || getSignType(selected)}</p>
                                </div>
                            </div>
                            {selectedInfo && (
                                <>
                                    <InfoBlock label="Description" text={selectedInfo.description} dc={dc} />
                                    <InfoBlock label="Driving Instruction" text={selectedInfo.instruction} dc={dc} icon="🚗" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoBlock label="Color" text={selectedInfo.colorDescription} dc={dc} icon="🎨" />
                                        <InfoBlock label="Shape" text={selectedInfo.shapeDescription} dc={dc} icon="📐" />
                                    </div>
                                    <div className={`p-4 rounded-xl ${dc ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                        <p className="text-xs font-bold text-red-400 mb-1">⚖️ Legal Consequences</p>
                                        <p className={`text-sm ${dc ? 'text-gray-300' : 'text-gray-600'}`}>{selectedInfo.legalConsequences}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ label, text, dc, icon }) {
    return (
        <div className={`p-4 rounded-xl ${dc ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-xs font-bold mb-1 ${dc ? 'text-gray-400' : 'text-gray-500'}`}>{icon} {label}</p>
            <p className={`text-sm ${dc ? 'text-gray-200' : 'text-gray-700'}`}>{text}</p>
        </div>
    );
}
