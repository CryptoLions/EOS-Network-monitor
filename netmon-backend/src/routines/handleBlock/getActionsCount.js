const getActionsCount = block => {
  if (block.transactions.length < 1) {
    return 0;
  }
  return block.transactions.reduce(
    (result, transaction) => result + (transaction.trx.transaction ? transaction.trx.transaction.actions.length : 1),
    0,
  );
};

module.exports = getActionsCount;
