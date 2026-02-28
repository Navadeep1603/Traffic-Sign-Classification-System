import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GTSRB_CLASSES, callClaude } from '../constants';

export default function GANGenerator({ apiKey, isDark }) {
    const [selectedSign, setSelectedSign] = useState(GTSRB_CLASSES[14]);
    const [asciiArt, setAsciiArt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [training, setTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [gLoss, setGLoss] = useState(4.5);
    const [dLoss, setDLoss] = useState(0.1);
    const intervalRef = useRef(null);

    const generateSign = useCallback(async () => {
        if (!apiKey) { setError('Please enter your API key in the sidebar.'); return; }
        setLoading(true);
        setError(null);
        try {
            const text = await callClaude(apiKey, [{
                role: 'user',
                content: `You are a GAN (Generative Adversarial Network) expert. A DCGAN is being used to generate synthetic traffic sign images for the GTSRB dataset. Generate a detailed ASCII art representation of a "${selectedSign}" traffic sign. The ASCII art should be at least 15 lines tall and clearly recognizable. Also briefly describe the pixel patterns, colors, and shapes that a GAN would generate for this sign. Format your response as:\n\nDESCRIPTION:\n[your description here]\n\nASCII ART:\n[your ascii art here]`
            }]);
            setAsciiArt(text);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [apiKey, selectedSign]);

    const startTraining = useCallback(() => {
        setTraining(true);
        setEpoch(0);
        setGLoss(4.5);
        setDLoss(0.1);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setEpoch(prev => {
                if (prev >= 200) { clearInterval(intervalRef.current); setTraining(false); return prev; }
                return prev + 1;
            });
            setGLoss(prev => Math.max(0.3, prev - (Math.random() * 0.04 + 0.01)));
            setDLoss(prev => Math.min(0.7, prev + (Math.random() * 0.005)));
        }, 80);
    }, []);

    useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

    const dc = isDark;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>GAN Synthetic Image Generator</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Simulate DCGAN-generated traffic sign images</p>
                </div>
            </div>

            {/* Controls */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <select value={selectedSign} onChange={e => setSelectedSign(e.target.value)}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none ${dc ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'} border`}>
                        {GTSRB_CLASSES.map((s, i) => <option key={i} value={s}>Class {i}: {s}</option>)}
                    </select>
                    <button onClick={generateSign} disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50">
                        {loading ? '⚡ Generating...' : '⚡ Generate Synthetic Sign'}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">⚠️ {error}</div>}

            {/* ASCII Art Output */}
            {asciiArt && (
                <div className={`rounded-2xl overflow-hidden ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
                        <h3 className="text-white font-semibold">🎨 GAN Output — {selectedSign}</h3>
                    </div>
                    <pre className={`p-6 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap ${dc ? 'text-green-400 bg-gray-900' : 'text-gray-800 bg-gray-50'}`}>
                        {asciiArt}
                    </pre>
                </div>
            )}

            {/* GAN Explanation */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`font-bold mb-4 ${dc ? 'text-white' : 'text-gray-800'}`}>How DCGAN Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${dc ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                        <h4 className="font-bold text-blue-400 mb-2">🔧 Generator</h4>
                        <p className={`text-sm ${dc ? 'text-gray-300' : 'text-gray-600'}`}>
                            Creates synthetic images from random noise vectors (z ~ N(0,1)). Uses transposed convolutions to upsample noise into realistic traffic sign images.
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl ${dc ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                        <h4 className="font-bold text-red-400 mb-2">🛡️ Discriminator</h4>
                        <p className={`text-sm ${dc ? 'text-gray-300' : 'text-gray-600'}`}>
                            Validates whether an image is real (from GTSRB) or fake (from Generator). Uses standard convolutions to classify image authenticity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Training Simulation */}
            <div className={`rounded-2xl p-6 ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${dc ? 'text-white' : 'text-gray-800'}`}>GAN Training Progress</h3>
                    <button onClick={startTraining} disabled={training}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${training
                            ? 'bg-yellow-500/20 text-yellow-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'}`}>
                        {training ? `Training Epoch ${epoch}/200...` : '▶ Start Training Simulation'}
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Epoch Progress */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className={dc ? 'text-gray-400' : 'text-gray-500'}>Epoch Progress</span>
                            <span className={dc ? 'text-gray-300' : 'text-gray-700'}>{epoch}/200</span>
                        </div>
                        <div className={`h-3 rounded-full overflow-hidden ${dc ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div className="h-full rounded-full bg-gradient-to-r from-electric to-purple-500 transition-all duration-100"
                                style={{ width: `${(epoch / 200) * 100}%` }} />
                        </div>
                    </div>
                    {/* Losses */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl text-center ${dc ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={`text-xs font-medium mb-1 ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Generator Loss</p>
                            <p className="text-2xl font-bold text-blue-400">{gLoss.toFixed(3)}</p>
                            <p className={`text-xs ${dc ? 'text-gray-500' : 'text-gray-400'}`}>↓ decreasing</p>
                        </div>
                        <div className={`p-4 rounded-xl text-center ${dc ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className={`text-xs font-medium mb-1 ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Discriminator Loss</p>
                            <p className="text-2xl font-bold text-red-400">{dLoss.toFixed(3)}</p>
                            <p className={`text-xs ${dc ? 'text-gray-500' : 'text-gray-400'}`}>→ converging to 0.5</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
