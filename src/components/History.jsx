import React from 'react';

export default function History({ history, onClear, isDark }) {
    const dc = isDark;
    const totalScans = history.length;
    const avgConf = totalScans > 0 ? (history.reduce((s, h) => s + (h.confidence || 0), 0) / totalScans).toFixed(1) : 0;
    const mostCommon = totalScans > 0
        ? Object.entries(history.reduce((acc, h) => { acc[h.signName] = (acc[h.signName] || 0) + 1; return acc; }, {}))
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
        : 'N/A';

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `classification_history_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🗂️</span>
                <div>
                    <h2 className={`text-2xl font-bold ${dc ? 'text-white' : 'text-navy'}`}>Classification History</h2>
                    <p className={`text-sm ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Log of all classified traffic signs</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className={`rounded-xl p-4 text-center ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <p className={`text-xs font-medium ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Total Scans</p>
                    <p className="text-3xl font-bold text-electric">{totalScans}</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <p className={`text-xs font-medium ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Avg Confidence</p>
                    <p className="text-3xl font-bold text-emerald-400">{avgConf}%</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${dc ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <p className={`text-xs font-medium ${dc ? 'text-gray-400' : 'text-gray-500'}`}>Most Common</p>
                    <p className={`text-sm font-bold mt-1 ${dc ? 'text-white' : 'text-gray-800'}`}>{mostCommon}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button onClick={exportJSON} disabled={totalScans === 0}
                    className="px-5 py-2.5 bg-gradient-to-r from-electric to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                    📥 Export as JSON
                </button>
                <button onClick={onClear} disabled={totalScans === 0}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${dc ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    🗑️ Clear History
                </button>
            </div>

            {/* History List */}
            {totalScans === 0 ? (
                <div className={`rounded-2xl p-16 text-center ${dc ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="text-6xl mb-4">🗂️</div>
                    <p className={`text-lg ${dc ? 'text-gray-400' : 'text-gray-500'}`}>No classifications yet</p>
                    <p className={`text-sm ${dc ? 'text-gray-500' : 'text-gray-400'}`}>Upload an image to get started</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {[...history].reverse().map((item, i) => {
                        const confColor = item.confidence >= 90 ? 'text-emerald-400' : item.confidence >= 70 ? 'text-yellow-400' : 'text-red-400';
                        return (
                            <div key={i} className={`rounded-xl p-4 flex gap-4 items-center transition-all hover:scale-[1.01] ${dc ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} shadow-md`}>
                                {item.image && (
                                    <img src={item.image} alt={item.signName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold truncate ${dc ? 'text-white' : 'text-gray-800'}`}>{item.signName}</p>
                                    <p className={`text-xs ${dc ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {item.category} • {new Date(item.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-xl font-bold ${confColor}`}>{item.confidence}%</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.warningLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                                            item.warningLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'}`}>
                                        {item.warningLevel}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
