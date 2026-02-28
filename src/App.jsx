import React, { useState, useCallback } from 'react';
import { NAV_ITEMS } from './constants';
import Classification from './components/Classification';
import AudioAlerts from './components/AudioAlerts';
import ConfidenceDashboard from './components/ConfidenceDashboard';
import GANGenerator from './components/GANGenerator';
import MetricsPanel from './components/MetricsPanel';
import LiveCamera from './components/LiveCamera';
import History from './components/History';
import Encyclopedia from './components/Encyclopedia';
import AVSimulation from './components/AVSimulation';

function Toast({ message, type, onClose }) {
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-electric',
    };
    return (
        <div className={`fixed top-6 right-6 z-50 ${colors[type] || colors.info} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up`}>
            <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span className="font-medium text-sm">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70 text-lg">×</button>
        </div>
    );
}

export default function App() {
    const [currentView, setCurrentView] = useState('classify');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [classificationResult, setClassificationResult] = useState(null);
    const [classificationHistory, setClassificationHistory] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const handleResult = useCallback((result) => {
        setClassificationResult(result);
        setClassificationHistory(prev => [...prev, result]);
        showToast(`Classified: ${result.signName} (${result.confidence}%)`, 'success');
    }, [showToast]);

    const clearHistory = useCallback(() => {
        setClassificationHistory([]);
        showToast('History cleared', 'info');
    }, [showToast]);

    const dc = isDarkMode;

    const renderView = () => {
        switch (currentView) {
            case 'classify':
                return (
                    <>
                        <Classification onResult={handleResult} isDark={dc} />
                        {classificationResult && (
                            <>
                                <ResultCard result={classificationResult} isDark={dc} />
                                <AudioAlerts result={classificationResult} selectedLanguage={selectedLanguage}
                                    setSelectedLanguage={setSelectedLanguage} isDark={dc} />
                            </>
                        )}
                    </>
                );
            case 'confidence':
                return <ConfidenceDashboard result={classificationResult} isDark={dc} />;
            case 'gan':
                return <GANGenerator isDark={dc} />;
            case 'metrics':
                return <MetricsPanel isDark={dc} />;
            case 'camera':
                return <LiveCamera onResult={handleResult} isDark={dc} />;
            case 'history':
                return <History history={classificationHistory} onClear={clearHistory} isDark={dc} />;
            case 'encyclopedia':
                return <Encyclopedia isDark={dc} />;
            case 'simulation':
                return <AVSimulation isDark={dc} />;
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${dc ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${dc ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r w-64 lg:w-20 xl:w-64`}>

                {/* Logo */}
                <div className="p-4 border-b border-inherit">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            TS
                        </div>
                        <div className="lg:hidden xl:block">
                            <h1 className={`text-sm font-bold leading-tight ${dc ? 'text-white' : 'text-navy'}`}>Traffic Sign</h1>
                            <p className="text-[10px] text-electric font-medium">CNN + GAN AI</p>
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(item => (
                        <button key={item.id} onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${currentView === item.id
                                    ? 'bg-gradient-to-r from-electric to-blue-600 text-white shadow-lg shadow-electric/20'
                                    : dc ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            <span className="lg:hidden xl:inline">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Bottom Controls */}
                <div className="p-3 border-t border-inherit space-y-2">
                    {/* Dark Mode Toggle */}
                    <button onClick={() => setIsDarkMode(!dc)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${dc ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
                        <span className="text-lg">{dc ? '☀️' : '🌙'}</span>
                        <span className="lg:hidden xl:inline">{dc ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    {/* Status */}
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400`}>
                        <span className="text-lg">✅</span>
                        <span className="lg:hidden xl:inline">AI Ready</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className={`sticky top-0 z-20 backdrop-blur-xl ${dc ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} border-b`}>
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-500/20">
                                <svg className={`w-6 h-6 ${dc ? 'text-white' : 'text-gray-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className={`text-lg sm:text-xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>
                                    <span className="bg-gradient-to-r from-electric to-purple-500 bg-clip-text text-transparent">
                                        Traffic Sign Classification System
                                    </span>
                                </h1>
                                <p className={`text-xs ${dc ? 'text-gray-500' : 'text-gray-400'}`}>Powered by CNN + GAN Deep Learning</p>
                            </div>
                        </div>
                        <span className="hidden sm:inline px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                            ✅ Offline Mode — No API Key Needed
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </div>

                {/* Footer */}
                <footer className={`px-6 py-4 text-center text-xs border-t ${dc ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                    <p>🚦 Traffic Sign Classification System — <span className="font-semibold text-electric">Team-64</span> — Powered by CNN + GAN Deep Learning</p>
                </footer>
            </main>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

function ResultCard({ result, isDark }) {
    const dc = isDark;
    const wlColors = {
        high: { bg: 'from-red-500/20 to-red-600/5', border: 'border-red-500/40', badge: 'bg-red-500' },
        medium: { bg: 'from-yellow-500/20 to-yellow-600/5', border: 'border-yellow-500/40', badge: 'bg-yellow-500' },
        low: { bg: 'from-green-500/20 to-green-600/5', border: 'border-green-500/40', badge: 'bg-green-500' },
    };
    const wc = wlColors[result.warningLevel] || wlColors.low;
    const confColor = result.confidence >= 90 ? '#10B981' : result.confidence >= 70 ? '#F59E0B' : '#EF4444';

    return (
        <div className={`rounded-2xl border ${wc.border} bg-gradient-to-r ${wc.bg} p-6 mt-6 animate-slide-up`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className={`text-xl font-bold ${dc ? 'text-white' : 'text-gray-800'}`}>{result.signName}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-electric">{result.category}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${wc.badge}`}>
                            {result.warningLevel?.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20" style={{ color: confColor }}>
                            GTSRB Class {result.germanGTSRBClass}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold" style={{ color: confColor }}>{result.confidence}%</p>
                    <p className={`text-xs ${dc ? 'text-gray-400' : 'text-gray-500'}`}>confidence</p>
                </div>
            </div>
            <div className={`p-4 rounded-xl ${dc ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                <p className={`text-sm font-medium ${dc ? 'text-gray-300' : 'text-gray-600'}`}>
                    🚗 <strong>Driving Instruction:</strong> {result.instruction}
                </p>
            </div>
        </div>
    );
}
