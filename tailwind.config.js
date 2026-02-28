/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                navy: '#1E2761',
                'navy-light': '#2A3578',
                'navy-dark': '#141B47',
                electric: '#4A90E2',
                'electric-light': '#6BA5EB',
                accent: '#FF6B35',
                'accent-light': '#FF8A5C',
            },
        },
    },
    plugins: [],
}
