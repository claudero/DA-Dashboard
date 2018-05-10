import devConfig from './dev.config';

const config = {
    'stage': 'dev',
    'environment': 'dev',
    'debugMode': 'true'
};

Object.assign(config, devConfig);

export default config;