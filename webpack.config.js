const fs = require( 'fs-extra' );
const path = require( 'path' );
const glob = require( 'glob' );
const webpack = require( 'webpack' );

const BUILD_DIR = path.join( __dirname, 'build' ) + path.sep;

// TODO: src/engine/ai/workers/*.js
const workers = glob.sync( 'src/engine/ai/*Worker.ts' );

const entry = {
	app: path.join( __dirname, 'src', 'app.tsx' )
};

for ( const workerPath of workers ) {
	const workerName = path.parse( workerPath ).name;
	entry[ workerName ] = path.join( __dirname, workerPath );
}

module.exports = {
	entry,

	output: {
		path: BUILD_DIR,
		filename: '[name].js'
	},

	devtool: 'source-map',

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
				publicPath: 'public' + path.sep,
			}
		} ],
	},

	resolve: {
		extensions: [ '.ts', '.tsx', '.jsx', '.js' ]
	},

	plugins: [
		new webpack.DefinePlugin( { 
			DEVELOPMENT: process.env.DEVELOPMENT === 'true' || process.argv.includes( '--dev' )
		} )
	]
}