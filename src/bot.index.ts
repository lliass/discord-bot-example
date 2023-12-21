import { MongoDataSource } from './shared/databases/mongo-db/data-source';
import { ExtendedClient } from './bot/extended-client';
import { logTool } from './shared/tools/index';

const extendedClient = new ExtendedClient();

MongoDataSource.initialize()
  .then(async () => {
    logTool.dynamicMessage({
      message: 'Mongo for bot has been initialized',
    });

    extendedClient.start();
  })
  .catch((error) =>
    logTool.error({
      errorMessage: 'An error on initialization of bot application',
      errorStack: error,
    }),
  );

export { extendedClient };
