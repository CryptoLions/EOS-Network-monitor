const express = require('express');
const initApiV1 = require('./api.v1');
const commands = require('./commands');

const init = ({ app, handlers, io }) => {
  if (process.env.NODE_ENV === 'local') {
    app.use('/', express.static(`${__dirname}/../../html`));
  } else {
    app.get('/', (req, res) => res.send('/'));
  }
  initApiV1({ app, handlers });
  commands({ app, io });
};

module.exports = init;
