import path from 'path'
import webpack from 'webpack'
import validate from 'webpack-validator'
import merge from 'webpack-mere'
import CleanPlugin from 'clean-webpack-plugin'

import pkg from './package.json'

const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING;
const PATHS = {
	app: path.join(__dirname, 'app'),
	dist: path.join(__dirname, 'dist'),
	test: path.join(__dirname, 'test')
};

const ENV = {
	host: process.env.HOST || 'localhost',
	port: process.env.PORT || 8000
};



process.env.BABEL_ENV = TARGET;

const common = {
	entry: {
		app: PATHS.app
	},

	resolve: {
		extensions: ['.js', '.jsx']
	},

	output: {
		path: PATHS.dist,
		filename: '[name].js'
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel-loader?cacheDirectory'],
				include: PATHS.app,
				query: {
					"presets": ["react", "stage-2"]
				}
			}
		]
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	]
}

switch(TARGET) {
	case "build":
	case "stats":
		config = merge(
			common,
			{
				devtool: 'source-map',

				entry: {
					vendor: Object.keys(pkg.dependencies).filter((v) => {
						return v !== 'alt-utils';
					})
				},

				output: {
					path: `${PATHS.dist}/vendor`,
					filename: '[name].[chunkhash].js',
					chunkFilename: '[chunkhash].js'
				},

				plugins: [
					new CleanPlugin([PATHS.dist]),
					new webpack.optimize.CommonsChunkPlugin({
						names: ['vendor', 'manifest']
					}),

					new webpack.DefinePlugin({
						'process.env.NODE_ENV': 'production'
					}),

					new webpack.optimize.UglifyJsPlugin({
						compress: {
							warnings: false
						}
					})
				]
			}
		);

		break;

	case 'test':
	case 'test:tdd':
		config = merge(
			common,

			{
				devtool: 'inline-source-map'
			}
		);

		break;

	default:
		config = merge(
			common,

			{
				devtool: 'eval-source-map',
				entry: {
					'webpack-hot-middleware/client?reload=true'
				}


			}
		);
}

module.exports = validate(config, {
	quiet: true
});
