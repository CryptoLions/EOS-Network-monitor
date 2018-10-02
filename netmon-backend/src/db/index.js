const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const { MONGODB } = require('config');

const AccountSchemaV2 = require('./schema/account.v2');
const TransactionSchemaV2 = require('./schema/transaction.v2');
const ProducerSchemaV2 = require('./schema/producer.v2');
const StateSchemaV2 = require('./schema/state.v2');
const TransactionToAccountSchemaV2 = require('./schema/transactionToAccount.v2');
const TransactionLastHourSchemaV2 = require('./schema/transactionLastHour.v2');
const BlockSchemaV2 = require('./schema/block.v2');
const RamSchemaV2 = require('./schema/ram.v2');

const connect = () => {
  const mongooseOptions = {
    autoIndex: true,
  };
  if (MONGODB.AUTH_IS_REQUIRED) {
    mongooseOptions.authSource = MONGODB.AUTH_SOURCE;
    mongooseOptions.useNewUrlParser = true;
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
  TransactionLastHourModelV2: mongoose.model('TransactionLastHour', TransactionLastHourSchemaV2),
  BlockModelV2: mongoose.model('Block', BlockSchemaV2),
  RamModelV2: mongoose.model('Ram', RamSchemaV2),
};
