const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './public/**/*.html',
        './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        fontFamily: {
            sans: ['sofia-pro', 'sans-serif']
        },
        colors: {
            lightPrimary: colors.white,
            lightSecondary: colors.neutral['400'],
            lightTertiary: colors.neutral['700'],
            
            darkPrimary: colors.neutral['900'],
            darkSecondary: colors.neutral['800'],
            darkTertiary: colors.neutral['700'],

            transparent: 'transparent',
            current: 'currentColor',
            white: colors.white,
            gray: colors.neutral,
            red: colors.red,
            blue: colors.sky,
            yellow: colors.amber,
            orange: colors.orange
        },
        extend: {

        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')
    ]
}
