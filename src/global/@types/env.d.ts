declare global {
  // eslint-disable-next-line no-unused-vars
  namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    export interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';
      DEBUG_LEVEL: 'info' | 'debug';
      SECRET: string;
    }
  }
}
