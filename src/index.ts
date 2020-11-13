/**
 * Main application entry point
 */

require('source-map-support').install();

import config from './providers/Config';
import Server from './classes/Server';
import dbInit from './dbInit';
import router from './routes';


(async function run() {
    await dbInit();
    const app = new Server(router, config.app);
    app.start();
})();


/**
 * Helper code to properly close app when event emitters are still active (app has opened connections)
 */

process.on('SIGINT', () => process.exit(0));
