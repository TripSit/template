import sourceMap from 'source-map-support'; // eslint-disable-line
import { DateTime } from 'luxon';
import { env } from './global/utils/env.config';
import { log } from './global/utils/log';
import validateEnv from './global/utils/env.validate'; // eslint-disable-line
sourceMap.install();

global.bootTime = DateTime.local();

const F = f(__filename);

const net = require('net');
// work around a node v20 bug: https://github.com/nodejs/node/issues/47822#issuecomment-1564708870
if (net.setDefaultAutoSelectFamily) {
  net.setDefaultAutoSelectFamily(false);
}

async function start() {
  log.info(F, 'Initializing service!');
  log.debug(F, `env: ${JSON.stringify(env, null, 2)}`);
  if (!validateEnv('PROJECT')) return;
  const bootDuration = global.bootTime.diffNow().negate().as('seconds');
  log.info(F, `Service finished booting in ${bootDuration}s!`);

  function checkTimers() {
    setTimeout(
      async () => {
        log.debug(F, `The time is now ${new Date()}`);
        checkTimers();
      },
      1000 * 5,
    );
  }
  log.debug(F, `The time is now ${new Date()}`);
  checkTimers();
}

start();

// Stop the bot when the process is closed (via Ctrl-C).
const destroy = () => {
  log.info(F, 'Gracefully stopping the bot (CTRL + C pressed)');
  process.exit(0);
};
process.on('SIGINT', destroy);
process.on('SIGTERM', destroy);
