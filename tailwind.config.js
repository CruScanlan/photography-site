const colors = require('tailwindcss/colors')

module.exports = {
    mode: 'jit',
    purge: [
        './public/**/*.html',
        './src/**/*.{js,jsx,ts,tsx}'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ['sofia-pro', 'sans-serif']
        },
        colors: {
            textPrimary: colors.white,
            textSecondary: colors.trueGray['400'],
            textTertiary: colors.trueGray['700'],
            bg1: colors.trueGray['900'],
            bg2: colors.trueGray['800'],
            bg3: colors.trueGray['700'],

            transparent: 'transparent',
            current: 'currentColor',
            white: colors.white,
            gray: colors.trueGray,
            red: colors.red,
            blue: colors.lightBlue,
            yellow: colors.amber,
            orange: colors.orange
        },
        extend: {

        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
