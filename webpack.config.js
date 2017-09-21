const fs = require( 'fs-extra' );
const path = require( 'path' );

const BUILD_DIR = path.join( __dirname, 'build' ) + path.sep;

module.exports = {
	entry: {
		app: path.join( __dirname, 'src', 'app.tsx' ),
		SimpleAIPlayerWorker: path.join( __dirname, 'src', 'engine', 'ai', 'SimpleAIPlayerWorker.ts' )
	},

	output: {
		path: BUILD_DIR,
		filename: '[name].js'
	},

	module: {
		rules: [ {
			test: /\.tsx?$/,
			loader: 'ts-loader',
		}, {
			test: /\.scss$/,
			use: [ {
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader",
			} ]
		}, {
			test: /\.(png|jpeg|ttf)$/,
			loader: 'file-loader',
			options: {
				publicPath: 'build' + path.sep,
			}
		} ],
	},

	resolve: {
		extensions: [ '.ts', '.tsx', '.jsx', '.js' ]
	}
}