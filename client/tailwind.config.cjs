/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Tus texturas
            backgroundImage: {
                'dots': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4xKSIvPjwvc3ZnPg==')",
                'hero-pattern': "url('/img/hero-pattern.svg')",
            },
            // Tus colores personalizados (que tenías antes)
            colors: {
                primary: "#212D40",
                secondary: "#212D40",
                terciary: "#364156",
                btnGreen: "#3E885B",
                btnRed: "#CC0000",
                accent: "#14b8a6",
                dark: "#11151c",
                light: "#f8fafc",
            },
            // Tus otras configuraciones
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                title: ["Poppins", "sans-serif"],
                montserrat: ['Montserrat Variable', 'sans-serif']
            },
            borderRadius: {
                xl2: "1.25rem",
            },
            keyframes: { // <-- Agrega esto
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.95)', opacity: '0.8' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                }
            },
            animation: { // <-- Y esto
                'fade-in': 'fadeIn 0.2s ease-out forwards',
                'scale-up': 'scaleUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', // Bounce effect
            }
        },
    },
    plugins: [],
}