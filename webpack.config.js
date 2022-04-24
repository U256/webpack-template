import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'
import {fileURLToPath} from 'url'

const { dirname, resolve } = path
const __filename = fileURLToPath(import.meta.url)

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
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|gif)$/,
                use: ['file-loader']
            }
        ]
    }
}

export default config