const path = require('path');

module.exports = {
    entry: {
        account: './client/account.jsx',
        app: './client/rosters.jsx',
        login: './client/login.jsx',
        roster: './client/roster.jsx'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ]
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};