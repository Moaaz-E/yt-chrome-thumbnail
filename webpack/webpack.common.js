const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const postCSS = require("postcss-loader");
const srcDir = path.join(__dirname, "..", "src");
const sveltePreprocess = require("svelte-preprocess");


module.exports = {
    mode: "development",
    // devtool: "cheap-module-source-map",
    devtool: "inline-source-map",
    entry: {
        popup: path.join(srcDir, 'popup.ts'),
        main: path.join(srcDir, 'main.ts'),
        // popup: path.join(srcDir, 'popup.tsx'),
        // options: path.join(srcDir, 'options.tsx'),
        // background: path.join(srcDir, 'background.ts'),
        // content_script: path.join(srcDir, 'content_script.tsx'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks: "async",
        },
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: 
                [{
                    loader: "svelte-loader",
                    options: {
                        preprocess: sveltePreprocess({})
                    }
                }],
                include: /src/,
                
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                include: /src/,
                exclude: /node_modules/,
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  "postcss-loader",
                  // Compiles Sass to CSS
                  "sass-loader"
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};