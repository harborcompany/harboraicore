export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#000000',
                secondary: '#111827',
                muted: '#6B7280',
                border: '#E5E7EB',
                accent: '#6366F1',
                cream: '#FFFFFF', // Resetting 'cream' to white as per brief
                charcoal: '#111827', // Mapping old var to new neutral
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '18px',
                'pill': '9999px',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }
        },
    },
    plugins: [],
}
