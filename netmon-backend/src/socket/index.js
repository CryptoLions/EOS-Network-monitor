const { MAX_TRANSACTIONS_PER_CONNECT_BY_SOCKET } = require('config');

const ROOM = 'room';

const init = ({ io, handlers }) => {
  const {
    userCount: userCountHandler,
    table: tableHandler,
    totalStacked: totalStackedHandler,
    transaction: transactionHandler,
    info: infoHandler,
    producerListOrder: producerListOrderHandler,
  } = handlers;
  userCountHandler.onUpdate((userCount) => {
    io.to(ROOM).emit('usersonline', userCount);
  });
  tableHandler.onUpdate(table => {
    io.to(ROOM).emit('table', table);
  });
  totalStackedHandler.onUpdate(totalStacked => {
    io.to(ROOM).emit('totalstaked', totalStacked);
  });
  producerListOrderHandler.onUpdate(() => {
    console.log('reload_producers');
    io.to(ROOM).emit('reload_producers');
  });
  transactionHandler.onUpdate(({ transactions, totalTransactionsCount, notEmptyBlocksCount, totalBlockCount }) => {
    io.to(ROOM).emit('transactions', {
      transactions: transactions.map(t => t.msgObject).slice(0, MAX_TRANSACTIONS_PER_CONNECT_BY_SOCKET),
      totalTransactionsCount,
      notEmptyBlocksCount,
      totalBlockCount,
    });
  });
  // let pre = 0;
  infoHandler.onUpdate(({ info, block }) => {
    // console.log(Date.now() - pre);
    // pre = Date.now();
    io.to(ROOM).emit('info', info);
    io.to(ROOM).emit('blockupdate', block);
  });
  io.on('connection', socket => {
    socket.join(ROOM);

    userCountHandler.addUser();
    socket.on('disconnect', () => {
      userCountHandler.minusUser();
    });
    //
    // socket.on('refresh', function(){
    //   //reinit Data from DB and send to userCount
    //   bc_parser.reinit();
    // });
    //
    // socket.on('reload', function(){
    //   //Refresh userss page for new update
    //   io.emit('reload', "1");
    // });
    //
    // socket.on('api', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.APIrequest(msg, socket);
    // });
    //
    // socket.on('register', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.register(msg, socket);
    // });
    //
    // socket.on('createAccount', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.createAccount(msg, socket);
    // });
    //
    // socket.on('faucet', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.faucet(msg, socket);
    // });
    // socket.on('accountInfo', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.accountInfo(msg, socket);
    // });
    //
    // socket.on('accountHist', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.accountHist(msg, socket);
    // });
    //
    // socket.on('TXinfo', function(msg){
    //   //Refresh userss page for new update
    //   bc_parser.TXinfo(msg, socket);
    // });
  });
};

module.exports = init;
