const { KEYSTORE: { RELOAD_PAGE, MAIN }, SOCKET_ROOM, RELOAD_PAGE_COOLDAWN } = require('config');

const { StateModelV2 } = require('../../db');

const init = ({ app, io }) => {
  app.get('/commands/:mainKey/:command', async (req, res) => {
    const { mainKey, command } = req.params;
    if (mainKey !== MAIN) {
      return res.send('');
    }
    switch (command) {
      case RELOAD_PAGE: {
        const { adminData: { frontendPageReloadAt } } = await StateModelV2.findOne({ id: 1 }).exec();
        if (Date.now() - Date.parse(frontendPageReloadAt) - RELOAD_PAGE_COOLDAWN < 0) {
          return res.send('cooldawn');
        }
        await StateModelV2.updateOne({ id: 1 }, { $set: { 'adminData.frontendPageReloadAt': new Date() } }).exec();
        io.to(SOCKET_ROOM).emit('reload_page');
        return res.send('reload');
      }
      default: {
        return res.send('');
      }
    }
  });
};

module.exports = init;
