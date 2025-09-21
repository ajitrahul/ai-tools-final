import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'primary': '#2dd4bf', // Teal 400
        'primary-focus': '#5eead4',
        'secondary': '#1f2937',
        'background': '#0f172a', // Slate 900
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'text-main': '#e2e8f0', // Slate 200
        'text-secondary': '#94a3b8', // Slate 400
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-poppins)'],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "aurora": { from: { backgroundPosition: '0% 50%' }, to: { backgroundPosition: '100% 50%' } },
        "fade-in": { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "aurora": "aurora 20s ease infinite",
        "fade-in": 'fadeIn 0.5s ease-in-out',
      },
      backgroundImage: {
          'aurora-gradient': 'radial-gradient(ellipse at 100% 0%, #2dd4bf 0%, #0f172a 50%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config