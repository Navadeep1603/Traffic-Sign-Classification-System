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

export function getSignCategory(classIndex) {
    for (const [key, cat] of Object.entries(SIGN_CATEGORIES)) {
        if (cat.signs.includes(classIndex)) return { key, ...cat };
    }
    return { key: 'other', color: '#6B7280', label: 'Unknown' };
}

// ---- MOCK CLASSIFICATION (no API needed) ----
const SIGN_INSTRUCTIONS = {
    'Speed Limit 20': 'Reduce speed to 20 km/h or below',
    'Speed Limit 30': 'Reduce speed to 30 km/h or below',
    'Speed Limit 50': 'Maintain speed at or below 50 km/h',
    'Speed Limit 60': 'Maintain speed at or below 60 km/h',
    'Speed Limit 70': 'Maintain speed at or below 70 km/h',
    'Speed Limit 80': 'Maintain speed at or below 80 km/h',
    'End Speed 80': 'End of 80 km/h speed limit zone — resume normal speed',
    'Speed Limit 100': 'Maintain speed at or below 100 km/h',
    'Speed Limit 120': 'Maintain speed at or below 120 km/h',
    'No Passing': 'Overtaking other vehicles is prohibited',
    'No Passing Trucks': 'Trucks are prohibited from overtaking',
    'Right-of-Way Intersection': 'You have right of way at the next intersection',
    'Priority Road': 'You are on a priority road — you have right of way',
    'Yield': 'Yield to oncoming traffic and give way',
    'Stop': 'Come to a complete stop before proceeding',
    'No Vehicles': 'No vehicles allowed beyond this point',
    'No Trucks': 'Trucks and heavy vehicles are prohibited',
    'No Entry': 'Entry is prohibited — do not proceed',
    'General Caution': 'Proceed with caution — general hazard ahead',
    'Curve Left': 'Dangerous left curve ahead — reduce speed',
    'Curve Right': 'Dangerous right curve ahead — reduce speed',
    'Double Curve': 'Series of curves ahead — maintain reduced speed',
    'Bumpy Road': 'Rough road surface ahead — reduce speed',
    'Slippery Road': 'Road may be slippery — drive carefully',
    'Narrow Right': 'Road narrows on the right side ahead',
    'Road Work': 'Construction zone ahead — slow down and watch for workers',
    'Traffic Signals': 'Traffic lights ahead — be prepared to stop',
    'Pedestrian Crossing': 'Pedestrian crossing ahead — watch for pedestrians',
    'Children Crossing': 'School zone — watch for children crossing',
    'Bicycle Crossing': 'Bicycle crossing ahead — watch for cyclists',
    'Ice/Snow': 'Risk of ice or snow on road — drive with extreme caution',
    'Wild Animals': 'Wild animals may cross — be alert',
    'End Restrictions': 'All previously posted restrictions are lifted',
    'Turn Right Ahead': 'Mandatory right turn ahead',
    'Turn Left Ahead': 'Mandatory left turn ahead',
    'Ahead Only': 'Continue straight ahead only',
    'Go Straight or Right': 'You may go straight or turn right',
    'Go Straight or Left': 'You may go straight or turn left',
    'Keep Right': 'Keep to the right side of the road',
    'Keep Left': 'Keep to the left side of the road',
    'Roundabout': 'Roundabout ahead — yield to traffic in circle',
    'End No Passing': 'End of no passing zone — overtaking allowed',
    'End No Passing Trucks': 'End of no passing zone for trucks',
};

function getWarningLevel(signName) {
    const high = ['Stop', 'No Entry', 'No Vehicles', 'Slippery Road', 'Ice/Snow', 'Children Crossing'];
    const medium = ['Yield', 'General Caution', 'Road Work', 'Pedestrian Crossing', 'Curve Left', 'Curve Right',
        'Double Curve', 'Bumpy Road', 'Narrow Right', 'Traffic Signals', 'Wild Animals', 'Bicycle Crossing'];
    if (high.includes(signName)) return 'high';
    if (medium.includes(signName)) return 'medium';
    return 'low';
}

function getCategoryName(signName) {
    const n = signName.toLowerCase();
    if (n.includes('speed') || n.includes('end speed')) return 'Speed Regulation';
    if (n.includes('no ') || n.includes('stop') || n.includes('end ')) return 'Prohibition';
    if (n.includes('curve') || n.includes('bumpy') || n.includes('slippery') || n.includes('narrow') ||
        n.includes('caution') || n.includes('crossing') || n.includes('ice') || n.includes('wild') ||
        n.includes('road work') || n.includes('traffic signals')) return 'Danger Warning';
    if (n.includes('keep') || n.includes('turn') || n.includes('ahead') || n.includes('go ') || n.includes('roundabout')) return 'Mandatory';
    return 'Other';
}

export function mockClassify() {
    const idx = Math.floor(Math.random() * GTSRB_CLASSES.length);
    const signName = GTSRB_CLASSES[idx];
    const confidence = Math.floor(Math.random() * 18) + 82; // 82-99
    const top2Idx = (idx + 1 + Math.floor(Math.random() * 5)) % GTSRB_CLASSES.length;
    const top3Idx = (idx + 6 + Math.floor(Math.random() * 10)) % GTSRB_CLASSES.length;
    return {
        signName,
        category: getCategoryName(signName),
        confidence,
        instruction: SIGN_INSTRUCTIONS[signName] || 'Follow the sign instruction and drive safely.',
        warningLevel: getWarningLevel(signName),
        germanGTSRBClass: idx,
        topPredictions: [
            { name: signName, confidence },
            { name: GTSRB_CLASSES[top2Idx], confidence: Math.max(5, confidence - 12 - Math.floor(Math.random() * 10)) },
            { name: GTSRB_CLASSES[top3Idx], confidence: Math.max(2, confidence - 30 - Math.floor(Math.random() * 15)) },
        ],
    };
}

// ---- MOCK ENCYCLOPEDIA (no API needed) ----
export const SIGN_INFO = Object.fromEntries(GTSRB_CLASSES.map((name, i) => {
    const cat = getCategoryName(name);
    const inst = SIGN_INSTRUCTIONS[name] || 'Observe the sign and comply.';
    const colors = cat === 'Prohibition' ? 'Red circle with white interior' :
        cat === 'Danger Warning' ? 'Red-bordered triangle with white interior' :
            cat === 'Mandatory' ? 'Blue circle with white symbol' :
                cat === 'Speed Regulation' ? 'Red circle border, white background, black number' :
                    'Varies by specific sign type';
    const shapes = cat === 'Prohibition' || cat === 'Speed Regulation' ? 'Circular' :
        cat === 'Danger Warning' ? 'Triangular (pointing up)' :
            cat === 'Mandatory' ? 'Circular' : 'Rectangular or diamond';
    const legal = cat === 'Prohibition' || name === 'Stop' || name === 'Yield'
        ? 'Violation may result in fines of €50-€200, points on license, and potential license suspension for repeat offenders.'
        : cat === 'Speed Regulation'
            ? 'Exceeding the posted speed limit can result in fines ranging from €30-€680, points on license, and possible driving ban.'
            : 'Ignoring this sign may result in fines and could endanger road users. Drivers are legally obligated to comply.';
    return [name, {
        description: `The ${name} sign (GTSRB Class ${i}) is a ${cat.toLowerCase()} sign commonly found on German roads. It alerts drivers to ${inst.toLowerCase()}.`,
        instruction: inst,
        colorDescription: colors,
        shapeDescription: shapes,
        legalConsequences: legal,
        category: cat,
    }];
}));

// ---- MOCK GAN ASCII ART (no API needed) ----
const ASCII_TEMPLATES = {
    circle: (label) => [
        '         ██████████         ',
        '      ██████████████████      ',
        '    ████              ████    ',
        '  ████    ██████████    ████  ',
        '  ████   ████████████   ████  ',
        ' ████    ████████████    ████ ',
        ' ████    ███ ' + label.padStart(4) + ' ███    ████ ',
        ' ████    ████████████    ████ ',
        '  ████   ████████████   ████  ',
        '  ████    ██████████    ████  ',
        '    ████              ████    ',
        '      ██████████████████      ',
        '         ██████████         ',
    ].join('\n'),
    triangle: (label) => [
        '              ▲              ',
        '             ███             ',
        '            █████            ',
        '           ███████           ',
        '          █████████          ',
        '         ███████████         ',
        '        █████' + label.padStart(3) + '█████        ',
        '       ███████████████       ',
        '      █████████████████      ',
        '     ███████████████████     ',
        '    █████████████████████    ',
        '   ███████████████████████   ',
        '  █████████████████████████  ',
        '  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  ',
    ].join('\n'),
    octagon: () => [
        '       ████████████       ',
        '     ██████████████████     ',
        '   ████████████████████████   ',
        '  ██████████████████████████  ',
        '  ████  S  T  O  P  ████████  ',
        '  ██████████████████████████  ',
        '   ████████████████████████   ',
        '     ██████████████████     ',
        '       ████████████       ',
    ].join('\n'),
    square: (label) => [
        '  ████████████████████████  ',
        '  ██                    ██  ',
        '  ██   ██████████████   ██  ',
        '  ██   ██  ' + label.padEnd(8) + '  ██   ██  ',
        '  ██   ██████████████   ██  ',
        '  ██                    ██  ',
        '  ████████████████████████  ',
    ].join('\n'),
};

export function mockGANGenerate(signName) {
    const n = signName.toLowerCase();
    let ascii, desc;

    if (n.includes('stop')) {
        ascii = ASCII_TEMPLATES.octagon();
        desc = 'Octagonal red sign with white STOP text.';
    } else if (n.includes('curve') || n.includes('bumpy') || n.includes('slippery') || n.includes('caution') ||
        n.includes('crossing') || n.includes('ice') || n.includes('wild') || n.includes('road work') || n.includes('traffic') || n.includes('yield')) {
        ascii = ASCII_TEMPLATES.triangle(n.includes('yield') ? 'YLD' : '!');
        desc = 'Triangular warning sign with red border and exclamation/warning symbol.';
    } else if (n.includes('speed')) {
        const num = n.replace(/\D/g, '').slice(0, 3) || '50';
        ascii = ASCII_TEMPLATES.circle(num);
        desc = `Circular sign with red border, white background, and black number ${num}.`;
    } else if (n.includes('keep') || n.includes('turn') || n.includes('ahead') || n.includes('go ') || n.includes('roundabout')) {
        ascii = ASCII_TEMPLATES.circle('→');
        desc = 'Blue circular mandatory sign with white directional arrow.';
    } else {
        ascii = ASCII_TEMPLATES.circle('⊘');
        desc = 'Circular prohibition sign with red border and slash.';
    }

    return `DESCRIPTION:\nThe DCGAN generator synthesizes a "${signName}" traffic sign image. ${desc} The generator network uses transposed convolutions to upsample a 100-dimensional noise vector into a 32×32 pixel RGB image. Pixel patterns show characteristic ${n.includes('triangle') || n.includes('curve') || n.includes('yield') ? 'triangular geometry with sharp edges' : 'circular symmetry with smooth gradients'}. Colors are vibrant with clear boundaries between red, white, and black/blue regions.\n\nASCII ART:\n${ascii}`;
}
