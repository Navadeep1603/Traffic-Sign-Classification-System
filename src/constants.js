export const GTSRB_CLASSES = [
    "Speed Limit 20", "Speed Limit 30", "Speed Limit 50", "Speed Limit 60", "Speed Limit 70",
    "Speed Limit 80", "End Speed 80", "Speed Limit 100", "Speed Limit 120", "No Passing",
    "No Passing Trucks", "Right-of-Way Intersection", "Priority Road", "Yield", "Stop",
    "No Vehicles", "No Trucks", "No Entry", "General Caution", "Curve Left",
    "Curve Right", "Double Curve", "Bumpy Road", "Slippery Road", "Narrow Right",
    "Road Work", "Traffic Signals", "Pedestrian Crossing", "Children Crossing", "Bicycle Crossing",
    "Ice/Snow", "Wild Animals", "End Restrictions", "Turn Right Ahead", "Turn Left Ahead",
    "Ahead Only", "Go Straight or Right", "Go Straight or Left", "Keep Right", "Keep Left",
    "Roundabout", "End No Passing", "End No Passing Trucks"
];

export const SIGN_CATEGORIES = {
    prohibition: { color: '#EF4444', label: 'Prohibition', signs: [9, 10, 14, 15, 16, 17] },
    danger: { color: '#F59E0B', label: 'Danger Warning', signs: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
    mandatory: { color: '#3B82F6', label: 'Mandatory', signs: [33, 34, 35, 36, 37, 38, 39, 40] },
    speed: { color: '#8B5CF6', label: 'Speed Regulation', signs: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    other: { color: '#10B981', label: 'Other', signs: [11, 12, 13, 32, 41, 42] },
};

export const ALERT_TRANSLATIONS = {
    en: (name, instruction) => `Warning! ${name} detected. ${instruction}. Please comply.`,
    es: (name, instruction) => `¡Advertencia! ${name} detectado. ${instruction}. Por favor cumpla.`,
    fr: (name, instruction) => `Attention! ${name} détecté. ${instruction}. Veuillez vous conformer.`,
    de: (name, instruction) => `Warnung! ${name} erkannt. ${instruction}. Bitte beachten Sie.`,
    hi: (name, instruction) => `चेतावनी! ${name} का पता चला। ${instruction}। कृपया अनुपालन करें।`,
    te: (name, instruction) => `హెచ్చరిక! ${name} గుర్తించబడింది. ${instruction}. దయచేసి పాటించండి.`,
};

export const LANGUAGES = [
    { code: 'en', name: 'English', voice: 'en-US' },
    { code: 'es', name: 'Spanish', voice: 'es-ES' },
    { code: 'fr', name: 'French', voice: 'fr-FR' },
    { code: 'de', name: 'German', voice: 'de-DE' },
    { code: 'hi', name: 'Hindi', voice: 'hi-IN' },
    { code: 'te', name: 'Telugu', voice: 'te-IN' },
];

export const METRICS = {
    without: { accuracy: 87.3, precision: 86.1, recall: 85.7, f1: 86.4 },
    with: { accuracy: 94.2, precision: 93.8, recall: 93.5, f1: 93.6 },
};

export const NAV_ITEMS = [
    { id: 'classify', icon: '🖼️', label: 'Classify' },
    { id: 'confidence', icon: '📊', label: 'Confidence' },
    { id: 'gan', icon: '🧠', label: 'GAN Generator' },
    { id: 'metrics', icon: '📈', label: 'Metrics' },
    { id: 'camera', icon: '📷', label: 'Live Camera' },
    { id: 'history', icon: '🗂️', label: 'History' },
    { id: 'encyclopedia', icon: 'ℹ️', label: 'Encyclopedia' },
    { id: 'simulation', icon: '🏎️', label: 'AV Simulation' },
];

export async function callClaude(apiKey, messages, maxTokens = 1024) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: maxTokens,
            messages,
        }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API Error ${res.status}`);
    }
    const data = await res.json();
    return data.content[0].text;
}

export function getSignCategory(classIndex) {
    for (const [key, cat] of Object.entries(SIGN_CATEGORIES)) {
        if (cat.signs.includes(classIndex)) return { key, ...cat };
    }
    return { key: 'other', color: '#6B7280', label: 'Unknown' };
}
