const	webpack			= require( 'webpack' ),
		path			= require( 'path' ),
		fs				= require( 'fs' ),
		{ execSync }	= require( 'child_process' ),
		websiteName		= 'dev.example.de',
		websitePath		= `/var/www/html/${ websiteName }/`,
		publicPath		= `https://${ websiteName }/`;

console.log( `\nRemoving old javascript and mapping files in ${ websitePath }...` );
fs.readdirSync( websitePath ).forEach( file  => {
	if( /\.js$|\.map$/.test( file ) ) {
		console.log( `\tremoving ${ file }` );
		fs.unlink( websitePath + file, () => {} );
	}
});
console.log( 'Done.\n' );

console.log( '\nCompiling BarFoos 2.0 Framework...\n' );
execSync( 'buildbf --target /home/zer0cool/projects/example_website --development' );
console.log( 'Done.\n' );

module.exports = {
	context:	__dirname,
	entry:		[ './app.js' ],
	output:		{
		path:			websitePath,
		publicPath:		publicPath,
		filename:		'[name]-bundle.js',
		chunkFilename:	'[id].[chunkhash].js'
	},
	resolve:	{
		modules:	[
			path.resolve( './node_modules/' ),
			path.resolve( './lib/' ),
			path.resolve( './modules/' )
		]
	},
	devtool:	'source-map',
	module:	{
		rules:	[
			{
				test:		/\.css$/,
				use: [
					{ loader:		'style-loader/useable' },
					{ loader:		'css-loader' }
				]
			},
			{
				test:		/\.scss$/,
				use: [
					{ loader:		'style-loader/useable' },
					{ loader:		'css-loader' },
					{ loader:		'sass-loader' }
				]
			},
			{
				test:		/\.html$/,
				use: [
					{ loader:		'raw-loader' }
				]
			},

			{
				test:		/\.(jpg|png|gif|ttf)$/,
				use: [
					{
						loader:		'url-loader',
						options:	{
							limit:				32000,
							useRelativePath:	false,
							publicPath:			publicPath
						}
					}
				]
			}
		]
	},
	plugins:	[
		new webpack.DefinePlugin({
			ENV_PROD:			false,
			ENV_PUBLIC_PATH:	`"${ publicPath }"`
		})
	],
	optimization:	{
		splitChunks:	{
			minSize:	4000
		}
	}
};
