import path from 'path'
import webpack from 'webpack'
import validate from 'webpack-validator'
import merge from 'webpack-merge'
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

const config = {
	entry: {
		app: PATHS.app
	},

	output: {
		path: PATHS.dist,
		filename: '[name].js'
	},

	resolve: {
		extensions: ['.js', '.jsx']
	},

	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				loaders: ['babel-loader?cacheDirectory']
			}
		]
	}
};

module.exports = validate(config, {
	quiet: true
});
