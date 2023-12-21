import { MongoDataSource } from './shared/databases/mongo-db/data-source';
import { logTool } from './shared/tools/index';
import Application from './api/application';

const application = new Application();

MongoDataSource.initialize()
  .then(async () => {
    logTool.dynamicMessage({
      message: 'Mongo for api has been initialized',
    });

    application.start();
  })
  .catch((error) =>
    logTool.error({
      errorMessage: 'An error on initialization of api application',
      errorStack: error,
    }),
  );
