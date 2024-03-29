import path from 'path'
import fs from 'fs-extra'
import {fileURLToPath} from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin.js'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const { dirname, resolve } = path
const __filename = fileURLToPath(import.meta.url)

const generatePath = (template = 'src') => resolve(dirname(__filename), template)

// TODO: handle html templates & image optimization

const pluginsForHtmlPages = fs
    .readdirSync(generatePath())
    .reduce((plugins, fileName) => {
        const [_, extension] = fileName.split('.')

        if (extension === 'html')
            return [
                ...plugins,
                new HtmlWebpackPlugin({
                    template: fileName,
                    filename: fileName,
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
const generateFileCopyPatterns = () => {
    const dest = {to: generatePath('dist')}

    return [
        {from: generatePath('src/assets/*.ico'), ...dest},
        {from: generatePath('src/assets/*.txt'), ...dest},
        {from: generatePath('src/images/*.(png|gif|jpg|jpeg)'), ...dest},
    ]
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
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'src': generatePath()
        }
    },
    optimization: getOptimizationConfig(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : undefined,
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: generateFileCopyPatterns()
        }),
        new MiniCssExtractPlugin({
            filename: generateFilename('css')
        }),
        new SpriteLoaderPlugin({
            plainSprite: true
        }),
        // TODO: implement load by "<-- t: template -->" comment
        // new HtmlReplaceWebpackPlugin([{
        //     pattern: /(<!--\s*t:\s*[a-zA-Z]+\s*-->)/g,
        //     replacement: (match) => {
        //         const finderRegexp = new RegExp('(?<=\\s*t:\\s*)[a-zA-Z]+')
        //         const value = (finderRegexp.exec(match) || [])[0]
        //
        //         return `<%= require(\'html-loader!./templates/${value}.html\').default %>`
        //     }
        // }]),
        ...pluginsForHtmlPages
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
                type: 'asset/resource'
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'icons.svg'

                        }
                    },
                    'svg-transform-loader',
                    'svgo-loader'
                ]
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                },
                exclude: /node_modules/,
                use: generateJsLoader()
            },
            {
                test: /\.m?ts$/,
                resolve: {
                    fullySpecified: false
                },
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