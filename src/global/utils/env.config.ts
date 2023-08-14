/* eslint-disable max-len */

/* eslint-disable @typescript-eslint/no-explicit-any */
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

export const env: NodeJS.ProcessEnv = {
  NODE_ENV: isProd ? 'production' : 'development',
  // DEBUG_LEVEL: isProd ? 'info' : 'debug',
  DEBUG_LEVEL: 'debug',
  SECRET1: process.env.SECRET1,
  SECRET2: process.env.SECRET2,
};

export default env;

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var env: NodeJS.ProcessEnv; // NOSONAR
}

global.env = env;
