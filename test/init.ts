
require('source-map-support').install();


import * as chai from 'chai';
import config from '../src/providers/Config';
import Server from '../src/classes/Server';
import modelsInit from '../src/dbInit';
import routes from '../src/routes';

chai.use(require('chai-http'));
chai.should();

const server = new Server(routes, config.app);
server.start();

export const testServer = (chai as any).request(server.server).keepOpen();


before (async function () {
    // @ts-ignore
    this.timeout(120 * 1000);    // Magical bind to Mocha context here to avoid timeout issue. That's why no arrow function allowed
    await modelsInit();
});
