const path = require( 'path' );
const express = require( 'express' );
const app = express();

app.use( express.static( 'public' ) );

app.get( '/', ( req, res ) => {
    const indexHtml = path.join( __dirname, './index.html' )
    res.sendFile( indexHtml, 'utf-8' );
} );

const PORT = process.env.PORT || 8080;

app.listen( PORT, () => {
    console.log( `App is running on the http://localhost:${ PORT }` );
} );
