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
            lightPrimary: colors.white,
            lightSecondary: colors.trueGray['400'],
            lightTertiary: colors.trueGray['700'],
            
            darkPrimary: colors.trueGray['900'],
            darkSecondary: colors.trueGray['800'],
            darkTertiary: colors.trueGray['700'],

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
