`use strict`;

let path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/script.js',
    output: {
        filename: 'bundle.js',
        parh: __dirname + '/dist/js'
    },
    watch: true,

    develop: 'source-map',

    module: {}
};