const express = require('express');
const initApiV1 = require('./api.v1');

const init = ({ app, handlers }) => {
  if (process.env.NODE_ENV === 'local') {
    app.use('/', express.static(`${__dirname}/../../html`));
  } else {
    app.get('/', (req, res) => res.send('/'));
  }
  initApiV1({ app, handlers });
};

module.exports = init;
