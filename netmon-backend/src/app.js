const { BUGSNAG_API_KEY, WHITE_LIST, ENABLE_CORS_SUPPORT, SERVER } = require('config');
require('appmetrics-dash').monitor();
const express = require('express');
const createSocketIO = require('socket.io');
const { Server } = require('http');
const cors = require('cors');
const compression = require('compression');
const bugsnag = require('bugsnag');

bugsnag.register(BUGSNAG_API_KEY, { appVersion: 1 });

const { connect: connectToDb } = require('./db');
const initHandlers = require('./handlers');
const initSocket = require('./socket');
const initEndpoints = require('./endpoints');

const { createLogger } = require('./helpers');
const corsOptionsDelegate = require('./helpers/corsOptionsDelegate');


const { info: logInfo, error: logError } = createLogger();

process.on('uncaughtException', (err) => {
  logError(`======= UncaughtException App :  ${err}`);
});

const app = express();
const http = Server(app);
const io = createSocketIO(http);

const start = async () => {
  app.use(bugsnag.requestHandler);
  app.use(compression());
  if (ENABLE_CORS_SUPPORT) {
    app.use(cors(corsOptionsDelegate(WHITE_LIST)));
  }
  try {
    await connectToDb();
    const handlers = await initHandlers();
    await initSocket({ io, handlers });
    await initEndpoints({ app, handlers, io });
    app.use(bugsnag.errorHandler);
  } catch (e) {
    logError(e);
    bugsnag.notify(e);
    return;
  }
  http.listen(SERVER.PORT, e => {
    if (e) {
      logError(e);
      bugsnag.notify(e);
      return;
    }
    logInfo(`SERVER IS NOW RUNNING ON ${SERVER.HOST}:${SERVER.PORT}.`, { send: true });
  });
};

start();
