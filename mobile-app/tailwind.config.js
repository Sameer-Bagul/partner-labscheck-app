module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#7B2CBF',
          600: '#6B21A8',
          700: '#5B1A90',
          800: '#4C1D7F',
          900: '#3B1363',
        },
        accent: {
          green: '#10B981',
          blue: '#3B82F6',
          yellow: '#F59E0B',
          red: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};
