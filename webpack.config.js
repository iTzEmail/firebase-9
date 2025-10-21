const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


// Main files
const mainDir = path.resolve(__dirname, 'src/js/main');
const mainFiles = fs.readdirSync(mainDir)
    .filter(f => f.endsWith('.js'))
    .map(f => path.resolve(mainDir, f));


// JS files
function getPageJsFiles(dir) {
    const entries = {};
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isFile() && file.endsWith('.js')) {
            const name = path.basename(file, '.js');
            entries[name] = fullPath;
        }
    });
    return entries;
}

const jsPagesDir = path.resolve(__dirname, 'src/js/pages');
const jsPages = getPageJsFiles(jsPagesDir);


// HTML files
const htmlDir = path.resolve(__dirname, 'src/html/pages');
const htmlPages = fs
    .readdirSync(htmlDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.basename(file, '.html'));

const htmlPlugins = htmlPages.map(page => {
    return new HtmlWebpackPlugin({
        template: path.join(htmlDir, `${page}.html`),
        filename: `${page}.html`,
        chunks: ['main', 'components', page]
    });
});


module.exports = {
    mode: 'production',
    entry: {
        main: mainFiles,
        components: fs.readdirSync(path.resolve(__dirname, 'src/js/components'))
            .filter(f => f.endsWith('.js'))
            .map(f => path.resolve(__dirname, 'src/js/components', f)),
        ...jsPages
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        ...htmlPlugins,
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/css', to: 'css' },
                { from: 'src/assets', to: 'assets', noErrorOnMissing: true },
                { from: 'src/html/components', to: 'components', noErrorOnMissing: true }
            ]
        })
    ],
    watch: true
};