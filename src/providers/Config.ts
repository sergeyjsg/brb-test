/**
 * Config Provider
 * Used to load application configuration from .YAML files
 * CONFIG environment variable should be provided in order to launch the app with the specified config
 *
 * This module is a singleton and will be initialized only once
 */

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { FullConfig } from '../definitions';


export class Config {

    public static init (): FullConfig {
        // If config file is not specified app will try to find it in the default location
        let configPath = process.env.CONFIG;
        if (!configPath) configPath = `config/config.yml`;

        const fullPath = path.resolve(configPath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`Could not launch App. Config file '${fullPath}' not found`);
        }

        // Schema validation can to be added to find incorrect config values
        return  yaml.safeLoad(fs.readFileSync(fullPath, 'utf8')) as FullConfig;
    }

}


export default Config.init();
