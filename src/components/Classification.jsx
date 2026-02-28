import React, { useState, useCallback } from 'react';
import { mockClassify } from '../constants';

export default function Classification({ onResult, isDark }) {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please upload a JPG or PNG image.');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }, []);

    const classify = useCallback(async () => {
        if (!preview) return;
        setLoading(true);
        setError(null);
        try {
            // Simulate AI processing delay
            await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
            const result = mockClassify();
            result.image = preview;
            result.timestamp = new Date().toISOString();
            onResult(result);
        } catch (e) {
            setError('Classification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [preview, onResult]);

    const dc = isDark;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🖼️</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Traffic Sign Classification</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Upload or capture a traffic sign image for AI analysis</p>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
          ${dragOver ? 'border-electric bg-electric/10 scale-[1.02]' : dc ? 'border-gray-600 hover:border-electric/60 bg-gray-800/50' : 'border-gray-300 hover:border-electric/60 bg-gray-50'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input id="file-input" type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => processFile(e.target.files[0])} />
                <div className="text-5xl mb-4">{dragOver ? '📥' : '📤'}</div>
                <p className={`text-lg font-semibold ${dc ? 'text-gray-200' : 'text-gray-700'}`}>
                    {dragOver ? 'Drop your image here!' : 'Drag & drop an image or click to browse'}
                </p>
                <p className={`text-sm mt-2 ${dc ? 'text-gray-500' : 'text-gray-400'}`}>Supports JPG, PNG</p>
            </div>

            {/* Preview & Classify */}
            {preview && (
                <div className={`rounded-2xl overflow-hidden ${dc ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
                    <div className="relative">
                        <img src={preview} alt="Preview" className="w-full max-h-80 object-contain bg-black/5" />
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-white font-medium">Analyzing with CNN Model...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-5 flex gap-3">
                        <button
                            onClick={classify}
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-electric to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-electric/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Classifying...' : '🔍 Classify Sign'}
                        </button>
                        <button
                            onClick={() => { setPreview(null); setError(null); }}
                            className={`py-3 px-6 rounded-xl font-semibold transition-all ${dc ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            ✕ Clear
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
                    <span className="text-xl">⚠️</span> {error}
                </div>
            )}
        </div>
    );
}
