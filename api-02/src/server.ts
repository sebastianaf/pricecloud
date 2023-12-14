import createApp from './app';
import config from './config';
import { initializeSocket } from './socket/socket';

createApp().then((servers) => {
  initializeSocket(servers.io);

  servers.httpServer.listen(config.port, () => {
    config.logger.info(`Server ready at http://0.0.0.0:${config.port}/`);
  });
});
