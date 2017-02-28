import http from 'http'
import appConfig from './server/express'

const ENV = (process.env.NODE_ENV || 'development');
const config = require(`./server/env/${ENV}`);
const app = appConfig();
const server = http.Server(app);

server.listen(config.server.port, () => {
	console.log(`Application is up and running at: ${config.server.host}${config.server.port} and the environment is currently: ${ENV}`);
});

global.config = config;

module.exports = server;