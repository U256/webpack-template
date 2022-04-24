import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import {fileURLToPath} from 'url'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const { dirname, resolve } = path
const __filename = fileURLToPath(import.meta.url)

const optimization = () => {
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

const config = {
    context: resolve(dirname(__filename), 'src'),
    mode: 'development',
    entry: {
        main: './index.js',

    },
    output: {
        filename: 'bundle.[contenthash].js',
        path: resolve(dirname(__filename), 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.png', '.jpg'],
        alias: {
            '@src': resolve(dirname(__filename), 'src')
        }
    },
    optimization: optimization(),
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
            filename: '[name].[contenthash].css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|ttf)$/,
                use: ['file-loader']
            },
            {
                test: /\.(png|svg|gif|jpg|jpeg)$/i,
                type: 'asset/resource'
            }
        ]
    }
}

export default config