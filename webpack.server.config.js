const fs = require( 'fs-extra' );
const path = require( 'path' );
const glob = require( 'glob' );
const webpack = require( 'webpack' );
const nodeExternals = require( 'webpack-node-externals' );

const BUILD_DIR = path.join( __dirname, 'build' ) + path.sep;

module.exports = {
	target: 'node',

	watch: false,

	watchOptions: {
		ignored: /node_modules/,
		aggregateTimeout: 300,
		poll: 1000
	},

	entry: path.join( __dirname, 'src', 'server.ts' ),

	output: {
		path: path.join( __dirname, 'server' ),
		filename: 'server.js'
	},

	devtool: 'source-map',

	module: {
		rules: [ {
			test: /\.ts$/,
			loader: 'ts-loader',
		} ]
	},

	resolve: {
		extensions: [ '.ts', '.js' ]
	},

	stats: 'minimal',

	externals: [
		nodeExternals()
	],
}