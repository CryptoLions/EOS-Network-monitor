const { MAX_TRANSACTIONS_PER_CONNECT_BY_SOCKET, SOCKET_ROOM } = require('config');

const init = ({ io, handlers }) => {
  const {
    userCount: userCountHandler,
    table: tableHandler,
    totalStacked: totalStackedHandler,
    transaction: transactionHandler,
    info: infoHandler,
    ram: ramHandler,
  } = handlers;
  userCountHandler.onUpdate(userCount => {
    io.to(SOCKET_ROOM).emit('usersonline', userCount);
  });
  tableHandler.onUpdate(table => {
    io.to(SOCKET_ROOM).emit('table', table);
  });
  totalStackedHandler.onUpdate(totalStacked => {
    io.to(SOCKET_ROOM).emit('totalstaked', totalStacked);
  });
  tableHandler.onOrderChange((table) => io.to(SOCKET_ROOM).emit('reload_producers', table));
  transactionHandler.onUpdate(({ transactions, totalTransactionsCount, notEmptyBlocksCount, totalBlockCount }) => {
    io.to(SOCKET_ROOM).emit('transactions', {
      transactions: transactions.map(t => t.msgObject).slice(0, MAX_TRANSACTIONS_PER_CONNECT_BY_SOCKET),
      totalTransactionsCount,
      notEmptyBlocksCount,
      totalBlockCount,
    });
  });
  infoHandler.onUpdate(({ info, block, chart }) => {
    io.to(SOCKET_ROOM).emit('info', info);
    io.to(SOCKET_ROOM).emit('blockupdate', block);
    io.to(SOCKET_ROOM).emit('blockchart', chart);
  });
  ramHandler.onUpdate(ram => io.to(SOCKET_ROOM).emit('ram', ram));
  io.on('connection', socket => {
    socket.join(SOCKET_ROOM);

    userCountHandler.addUser();
    socket.on('disconnect', () => {
      socket.leave(SOCKET_ROOM);
      userCountHandler.minusUser();
    });
  });
};

module.exports = init;
