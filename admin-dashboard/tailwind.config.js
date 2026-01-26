/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Instrument Serif', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // Using standard tailwind colors for now, leveraging slate/zinc/stone
            }
        },
    },
    plugins: [],
}
