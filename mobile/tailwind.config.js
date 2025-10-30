module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#10002B',
          800: '#240046',
          700: '#3C096C',
          600: '#5A189A',
          500: '#7B2CBF',
          400: '#9D4EDD',
          300: '#C77DFF',
          200: '#E0AAFF',
          100: '#F5E0FF',
        },
        accent: {
          green: '#16A34A',
          'green-dark': '#059669',
          'green-light': '#86EFAC',
        },
      },
    },
  },
  plugins: [],
};
