module.exports = {
    content: ['./index.html', './src/**/*.tsx'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['forest'],
    },
};