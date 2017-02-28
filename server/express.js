import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import compression from 'compression'
import config from '../webpack.config.babel'

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

module.exports = () => {
	const app = express();



	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../app/index.html'));
	});

	app.use(morgan('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(compression());
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
		next();
	});

	app.use(express.static(path.join(__dirname, '../app')));
	app.use(express.static(path.join(__dirname, '../dist')));
	app.use(express.static(path.join(__dirname, '../node_modules')));

	return app
}

