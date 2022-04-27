import path from 'path'
import fs from 'fs-extra'
import {fileURLToPath} from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const { dirname, resolve } = path
const __filename = fileURLToPath(import.meta.url)

const generatePath = (template = 'src') => resolve(dirname(__filename), template)

const pluginsForHtmlPages = fs
    .readdirSync(generatePath())
    .reduce((plugins, fullName) => {
        const [name, extension] = fullName.split('.')

        if (extension === 'html')
            return [
                ...plugins,
                new HtmlWebpackPlugin({
                    filename: `${name}.html`,
                    inject: 'body',
                    minify: {
                        collapseWhitespace: isProd
                    },
                })
            ]

        return plugins
    }, [])
const getOptimizationConfig = () => {
     const cfg = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        cfg.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return cfg
}
const generateFilename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const generateCssLoader = (extra) => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}
const generateJsLoader = (additionalPreset) => {
    let loaders = {
        loader: "babel-loader",
        options: {
            presets: [[
                "@babel/preset-env",
                {
                    "useBuiltIns": "usage",
                    "corejs": 2
                }
            ]]
        }
    }

    if (additionalPreset) {
        loaders.options.presets.push(additionalPreset)
    }

    // if (isDev) {
    //     loaders.options.presets.push('eslint-loader')
    // }

    return loaders
}

const config = {
    context: generatePath(),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './js/index.js'],

    },
    output: {
        filename: generateFilename('js'),
        path: generatePath('dist')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.png', '.jpg'],
        alias: {
            'src': generatePath()
        }
    },
    optimization: getOptimizationConfig(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    // Вернуть!!!
    // devtool: isDev ? 'source-map' : undefined,
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(dirname(__filename), 'src/favicon.ico'),
                    to: resolve(dirname(__filename), 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: generateFilename('css')
        })
    ].concat(pluginsForHtmlPages),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: generateCssLoader()
            },
            {
                test: /\.s[ac]ss$/,
                use: generateCssLoader('sass-loader')
            },
            {
                test: /\.(woff|woff2|ttf)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(png|svg|gif|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: generateJsLoader()
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: generateJsLoader('@babel/preset-typescript')
            },
            {
                test: /\.m?jsx$/,
                exclude: /node_modules/,
                use: generateJsLoader('@babel/preset-react')
            }
        ]
    }
}

export default config