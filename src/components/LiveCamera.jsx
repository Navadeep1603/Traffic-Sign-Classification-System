import React, { useState, useRef, useCallback } from 'react';
import { callClaude } from '../constants';

export default function LiveCamera({ apiKey, onResult, isDark }) {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastDetection, setLastDetection] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 640, height: 480 } });
            streamRef.current = stream;
            if (videoRef.current) { videoRef.current.srcObject = stream; }
            setActive(true);
            setError(null);
        } catch (e) {
            setError('Camera access denied. Please allow camera permissions.');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); }
        setActive(false);
        setLastDetection(null);
    }, []);

    const capture = useCallback(async () => {
        if (!videoRef.current || !apiKey) {
            setError(!apiKey ? 'Please enter your API key in the sidebar.' : 'Camera not ready.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const base64 = dataUrl.split(',')[1];
            const text = await callClaude(apiKey, [{
                role: 'user',
                content: [
                    { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
                    { type: 'text', text: 'You are a traffic sign classification expert. Analyze this camera frame and identify any traffic sign visible. Return ONLY valid JSON: { "signName": string, "category": string, "confidence": number (0-100), "instruction": string, "warningLevel": "low"|"medium"|"high", "germanGTSRBClass": number (0-42), "topPredictions": [{"name": string, "confidence": number}, {"name": string, "confidence": number}, {"name": string, "confidence": number}] }' }
                ]
            }]);
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Invalid response');
            const result = JSON.parse(jsonMatch[0]);
            result.image = dataUrl;
            result.timestamp = new Date().toISOString();
            setLastDetection(result);
            onResult(result);
        } catch (e) {
            setError(e.message || 'Classification failed.');
        } finally {
            setLoading(false);
        }
    }, [apiKey, onResult]);

    const dc = isDark;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
                <span className="text-3xl">📷</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Live Camera Mode</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Real-time traffic sign detection via webcam</p>
                </div>
            </div>

            <div className={`rounded-2xl overflow-hidden ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                {/* Video Frame */}
                <div className="relative bg-black aspect-video">
                    {active ? (
                        <>
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            {lastDetection && (
                                <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur rounded-xl border border-electric/50">
                                    <p className="text-white font-bold text-sm">{lastDetection.signName}</p>
                                    <p className="text-electric text-xs">{lastDetection.confidence}% confidence</p>
                                </div>
                            )}
                            {loading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        <p className="text-white font-medium">Analyzing frame...</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center min-h-[300px]">
                            <div className="text-6xl mb-4">📷</div>
                            <p className={`text-lg ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Camera is off</p>
                            <p className={`text-sm ${dc ? 'text-gray-500' : 'text-gray-400'}`}>Click below to start live detection</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-5 flex gap-3">
                    <button onClick={active ? stopCamera : startCamera}
                        className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${active
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30'}`}>
                        {active ? '⏹ Stop Camera' : '▶ Start Live Detection'}
                    </button>
                    {active && (
                        <button onClick={capture} disabled={loading}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-electric to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-electric/30 transition-all disabled:opacity-50">
                            {loading ? 'Capturing...' : '📸 Capture & Classify'}
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">⚠️ {error}</div>}
        </div>
    );
}
