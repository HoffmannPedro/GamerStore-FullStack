/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // --- TEXTURAS (GamerStore) ---
            backgroundImage: {
                'dots': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4xKSIvPjwvc3ZnPg==')",
                'hero-pattern': "url('/img/hero-pattern.svg')",
            },
            
            // --- PALETA DE COLORES (GamerStore) ---
            colors: {
                // Colores oficiales de GamerStore
                primary: "#212D40",
                secondary: "#212D40",
                terciary: "#364156",
                btnGreen: "#3E885B", // Verde Gamer
                btnRed: "#CC0000",
                accent: "#14b8a6",   // Teal secundario
                dark: "#11151c",     // Fondo oscuro principal
                light: "#f8fafc",

                // --- ALIAS DE COMPATIBILIDAD (Truco para PixelArt) ---
                // Mapeamos las clases viejas a los colores nuevos
                'pixel-bg': '#11151c',      // Ahora usa el 'dark' de GamerStore
                'pixel-card': '#364156',    // Ahora usa el 'terciary' (gris azulado)
                'pixel-teal': '#3E885B',    // Ahora usa el 'btnGreen'
                'pixel-purple': '#14b8a6',  // Ahora usa el 'accent'
                'pixel-text': '#f8fafc',    // Blanco
                'pixel-muted': '#9CA3AF',   // Gris medio
            },

            // --- FUENTES (GamerStore) ---
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                title: ["Poppins", "sans-serif"],
                montserrat: ['Montserrat Variable', 'sans-serif'],
                ethno: ['Ethnocentric-Regular', 'sans-serif']
            },

            borderRadius: {
                xl2: "1.25rem",
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.95)', opacity: '0.8' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out forwards',
                'scale-up': 'scaleUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            }
        },
    },
    plugins: [],
}