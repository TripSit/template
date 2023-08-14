import { stripIndents } from 'common-tags';

export default function validateEnv(
  service: 'PROJECT',
) {
  const F = f(__filename);

  if (service === 'PROJECT') {
    if (!process.env.SECRET1) {
      log.warn(F, stripIndents`Missing SECRET1 the service will not have full functionality!`);
    }
    if (!process.env.SECRET2) {
      log.error(F, stripIndents`Missing SECRET2 the service will not be able to start!`);
      return false;
    }
  }

  log.info(F, 'Environment variables validated successfully!');
  return true;
}
