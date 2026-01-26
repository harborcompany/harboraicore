export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    800: '#292524',
                    900: '#1c1917',
                },
                cream: '#F9F8F6',
                charcoal: '#1A1A1A',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '3rem',
            }
        },
    },
    plugins: [],
}
