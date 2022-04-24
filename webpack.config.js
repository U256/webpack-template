import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import {fileURLToPath} from 'url'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const { dirname, resolve } = path
const __filename = fileURLToPath(import.meta.url)

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

    return cfg;
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

const config = {
    context: resolve(dirname(__filename), 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],

    },
    output: {
        filename: generateFilename('js'),
        path: resolve(dirname(__filename), 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.png', '.jpg'],
        alias: {
            '@src': resolve(dirname(__filename), 'src')
        }
    },
    optimization: getOptimizationConfig(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
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
    ],
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
                use: ['file-loader']
            },
            {
                test: /\.(png|svg|gif|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
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
            }
        ]
    }
}

export default config