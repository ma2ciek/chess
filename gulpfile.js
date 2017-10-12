const webpack = require( 'webpack' );
const gulp = require( 'gulp' );
const { fork } = require('child_process');

const options = {
	watch: process.argv.includes( '-w' ),
}

gulp.task( 'start', [ '' ], () => {
	
} )

gulp.task( 'server', done => {
	const serverConfig = require( './webpack.server.config.js' );
	let forkedServer;

	if ( options.watch ) {
		serverConfig.watch = true;

		webpack( serverConfig, ( err, stats ) => {
			if ( err ) {
				return done( err );
			}

			if ( forkedServer ) {
				forkedServer.kill();
			}

			forkedServer = fork( './server/server' );

			console.log( '[Webpack] Rebuilding server.' );
		} );
	} else {
		webpack( serverConfig, ( err, stats ) => {
			if ( err ) {
				return done( err );
			}

			console.log( stats );

			forkedServer = fork( './server/server' );

			done();
		} );
	}
} );
