const express = require('express');
const createSocketIO = require('socket.io');
const { Server } = require('http');
const cors = require('cors');
const compression = require('compression');

const { WHITE_LIST, ENABLE_CORS_SUPPORT, SERVER } = require('config');

const { connect: connectToDb } = require('./db');
const initHandlers = require('./handlers');
const initSocket = require('./socket');
const initEndpoints = require('./endpoints');

const { createLogger } = require('./helpers');
const corsOptionsDelegate = require('./helpers/corsOptionsDelegate');

const { info: logInfo, error: logError } = createLogger('APP');

const app = express();
const http = Server(app);
const io = createSocketIO(http);

const start = async () => {
  app.use(compression());
  if (ENABLE_CORS_SUPPORT) {
    app.use(cors(corsOptionsDelegate(WHITE_LIST)));
  }
  try {
    await connectToDb();
    const handlers = await initHandlers();
    await initSocket({ io, handlers });
    await initEndpoints({ app, handlers, io });
  } catch (e) {
    logError('FAIL');
    console.log(e)
    return;
  }
  http.listen(SERVER.PORT, (err) => {
    if (err) {
      logError('FAIL');
      console.log(err)
      return;
    }
    logInfo(`SERVER IS NOW RUNNING ON ${SERVER.HOST}:${SERVER.PORT}.`);
  });
};

start();
