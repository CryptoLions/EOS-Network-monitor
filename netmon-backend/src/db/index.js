const mongoose = require('mongoose');
const { MONGODB } = require('config');

const AccountSchemaV2 = require('./schema/account.v2');
const TransactionSchemaV2 = require('./schema/transaction.v2');
const ProducerSchemaV2 = require('./schema/producer.v2');
const StateSchemaV2 = require('./schema/state.v2');
const TransactionToAccountSchemaV2 = require('./schema/transactionToAccount.v2');

const connect = () => {
  const mongooseOptions = {
    autoIndex: true,
  };
  if (MONGODB.AUTH_IS_REQUIRED) {
    mongooseOptions.authSource = MONGODB.AUTH_SOURCE;
    mongooseOptions.auth = {
      user: MONGODB.USER,
      password: MONGODB.PASSWORD,
    };
  }
  return mongoose.connect(
    MONGODB.ADDRESS + MONGODB.DB_NAME,
    mongooseOptions,
  );
};

module.exports = {
  connect,
  TransactionModelV2: mongoose.model('Transaction', TransactionSchemaV2),
  ProducerModelV2: mongoose.model('Producer', ProducerSchemaV2),
  AccountModelV2: mongoose.model('Account', AccountSchemaV2),
  StateModelV2: mongoose.model('State', StateSchemaV2),
  TransactionToAccountV2: mongoose.model('TransactionToAccount', TransactionToAccountSchemaV2),
};
