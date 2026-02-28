import React, { useState, useEffect, useCallback } from 'react';
import { LANGUAGES, ALERT_TRANSLATIONS } from '../constants';

export default function AudioAlerts({ result, selectedLanguage, setSelectedLanguage, isDark }) {
    const [speaking, setSpeaking] = useState(false);

    const speak = useCallback((text, langCode) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const lang = LANGUAGES.find(l => l.code === langCode);
        utter.lang = lang?.voice || 'en-US';
        utter.rate = 0.9;
        utter.pitch = 1;
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        utter.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utter);
    }, []);

    useEffect(() => {
        if (result) {
            const translator = ALERT_TRANSLATIONS[selectedLanguage] || ALERT_TRANSLATIONS.en;
            const text = translator(result.signName, result.instruction);
            const timer = setTimeout(() => speak(text, selectedLanguage), 500);
            return () => clearTimeout(timer);
        }
    }, [result, selectedLanguage, speak]);

    if (!result) return null;

    const translator = ALERT_TRANSLATIONS[selectedLanguage] || ALERT_TRANSLATIONS.en;
    const alertText = translator(result.signName, result.instruction);
    const wl = result.warningLevel;
    const alertColors = {
        high: { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/40', text: 'text-red-400', icon: '🔴', badge: 'bg-red-500' },
        medium: { bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/40', text: 'text-yellow-400', icon: '🟡', badge: 'bg-yellow-500' },
        low: { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/40', text: 'text-green-400', icon: '🟢', badge: 'bg-green-500' },
    };
    const ac = alertColors[wl] || alertColors.low;
    const dc = isDark;

    return (
        <div className="mt-6 animate-slide-up">
            <div className={`rounded-2xl border ${ac.border} bg-gradient-to-r ${ac.bg} p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🔊</span>
                        <h3 className={`font-bold text-lg ${dc ? 'text-white' : 'text-gray-800'}`}>Audio Alert</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${ac.badge}`}>
                            {wl?.toUpperCase()}
                        </span>
                    </div>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border-0 outline-none ${dc ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                    >
                        {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                    </select>
                </div>
                <p className={`text-base mb-4 leading-relaxed ${dc ? 'text-gray-200' : 'text-gray-700'}`}>
                    {ac.icon} {alertText}
                </p>
                <button
                    onClick={() => speak(alertText, selectedLanguage)}
                    disabled={speaking}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${speaking
                        ? 'bg-gray-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-electric to-blue-600 text-white hover:shadow-lg hover:shadow-electric/30'}`}
                >
                    {speaking ? '🔊 Speaking...' : '🔊 Replay Alert'}
                </button>
            </div>
        </div>
    );
}
