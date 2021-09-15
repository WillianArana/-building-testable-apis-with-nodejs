/* eslint-disable no-console */
import setupApp from './app';

const port = 3000;

(async () => {
  try {
    const app = await setupApp();
    const server = app.listen(port, () => {
      console.info(`Example app listening at http://localhost:${port}`);
    });

    const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    exitSignals.forEach((sig) => {
      process.on(sig, () => {
        server.close((err) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }

          app.get('database').close(() => {
            console.info('Database connection closed!');
            process.exit(0);
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
