/* eslint-disable no-mixed-operators */
const flatten = require('lodash/flatten');
const uniq = require('lodash/uniq');
const { eosApi, createLogger } = require('../../helpers');

const { info: logInfo } = createLogger();

const lt = /</g;
const gt = />/g;
const ap = /'/g;
const ic = /"/g;

const processAction = ({ block_num, transaction, id, producer, withSubActions = false }) => async (action) => {
  const { name, account, authorization: [{ actor = '' } = {}] = [] } = action;
  const processedSubActions = [];
  let { data } = action;
  const result = { txid: id, producer, blocknum: block_num };

  if (typeof data === 'string') {
    try {
      data = await eosApi.abiBinToJson({ code: account, action: name, binargs: data });
      result.isSerialized = true;
    } catch (e) {
      logInfo(`Action from ${id} is broken. The data defined in the ABI (${data}) is invalid`);
      return undefined;
    }
  }
  if (withSubActions && data.trx && data.trx.actions) {
    processedSubActions.push(
      ...await Promise.all(
        data.trx.actions.map(processAction({ block_num, transaction, id, producer })),
      ),
    );
  }

  const msgObject = { c1: block_num, c2: name };

  let txInfo_description = '';
  let txTo = '';

  const mentionedAccounts = [];

  switch (name) {
    case 'setcode': {
      msgObject.c3 = account;
      msgObject.c4 = '->';
      msgObject.c5 = data.account;
      msgObject.c6 = data.account;
      txTo = data.account;

      mentionedAccounts.push(account);
      mentionedAccounts.push(data.account);

      txInfo_description = 'smart contract';
      break;
    }
    case 'setabi': {
      msgObject.c3 = account;
      msgObject.c4 = '->';
      msgObject.c5 = data.account;
      msgObject.c6 = data.account;

      txTo = data.account;

      mentionedAccounts.push(account);
      mentionedAccounts.push(data.account);

      txInfo_description = 'smart contract';
      break;
    }

    case 'newaccount': {
      msgObject.c3 = data.creator;
      msgObject.c4 = '->';
      msgObject.c5 = data.name;
      msgObject.c6 = '';
      const newAcc = {
        name: data.name,
        createdBy: data.creator,
        date: transaction.expiration,
        balances: { EOS: 0 },
        createdAccounts: [],
      };
      result.newAccount = newAcc;

      txTo = data.name;
      mentionedAccounts.push(data.name);
      mentionedAccounts.push(data.creator);

      txInfo_description = `${data.creator} created account for ${data.name}`;
      break;
    }

    case 'setprods': {
      msgObject.c3 = account;
      msgObject.c4 = 'producers:';
      let newProds = '';
      mentionedAccounts.push(
        ...data.schedule.map(schedule => {
          newProds += `${schedule.producer_name}, `;
          return schedule.producer_name;
        }),
      );

      msgObject.c5 = newProds;
      msgObject.c6 = '';

      txTo = '';
      txInfo_description = `new producers:${newProds}`;
      mentionedAccounts.push(account);
      break;
    }

    case 'create': {
      if (!data.issuer) data.to = '';
      if (!data.maximum_supply) data.to = '';

      msgObject.c3 = `${actor}@${account}`;
      msgObject.c4 = 'Issue';
      msgObject.c5 = data.issuer;
      msgObject.c6 = data.maximum_supply;

      txTo = data.issuer;

      mentionedAccounts.push(actor || '');
      mentionedAccounts.push(data.issuer);
      mentionedAccounts.push(account);

      txInfo_description = 'Token Create issuer';
      break;
    }

    case 'issue': {
      msgObject.c3 = `${actor}@${account}`;
      if (!data.to) data.to = '';
      if (!data.quantity) data.to = '';
      if (!data.memo) data.to = '';
      msgObject.c4 = `${data.to}`;
      msgObject.c5 = data.quantity;

      msgObject.c6 = (data.memo || '')
        .toString()
        .replace(lt, '&lt;')
        .replace(gt, '&gt;')
        .replace(ap, '&#39;')
        .replace(ic, '&#34;');
      txTo = data.to;

      mentionedAccounts.push(actor);
      mentionedAccounts.push(account);
      mentionedAccounts.push(data.to);

      txInfo_description = 'Token issue Funds';
      break;
    }

    case 'transfer': {
      if (!data.from) data.from = '';
      if (!data.to) data.to = '';
      if (!data.quantity) data.quantity = '';
      if (!data.memo) data.memo = '';

      msgObject.c3 = `${actor}@${account}`;
      msgObject.c4 = `${data.from}>${data.to}`;
      msgObject.c5 = data.quantity;
      msgObject.c6 =
        (data.memo &&
          data.memo
            .toString()
            .replace(lt, '&lt;')
            .replace(gt, '&gt;')
            .replace(ap, '&#39;')
            .replace(ic, '&#34;')) ||
        '';

      txTo = data.to;

      mentionedAccounts.push(actor);
      mentionedAccounts.push(data.from);
      mentionedAccounts.push(data.to);
      txInfo_description = 'Token transfer';

      break;
    }

    case 'getbalance': {
      msgObject.c3 = `${actor}@${account}`;
      msgObject.c4 = 'owner';
      msgObject.c5 = data.owner;
      msgObject.c6 = '';

      txTo = '';
      txInfo_description = 'Token getbalance';
      break;
    }
    case 'buyrambytes': {
      msgObject.c3 = `${actor}@${action.account}`;
      msgObject.c4 = '>';
      msgObject.c5 = data.receiver;
      msgObject.c6 = `${data.bytes} bytes`;

      txTo = '';

      mentionedAccounts.push(action.authorization[0].actor);
      mentionedAccounts.push(action.account);
      mentionedAccounts.push(data.receiver);

      txInfo_description = 'buyrambytes';
      break;
    }
    case 'buyram': {
      msgObject.c3 = `${data.payer}@${action.account}`;
      msgObject.c4 = '>';
      msgObject.c5 = data.receiver;
      msgObject.c6 = `${data.quant}`;

      txTo = '';

      mentionedAccounts.push(data.payer);
      mentionedAccounts.push(data.receiver);

      txInfo_description = 'buyram';
      break;
    }

    case 'sellram': {
      msgObject.c3 = data.account;
      msgObject.c4 = `${data.bytes} bytes`;
      msgObject.c5 = '';
      msgObject.c6 = '';

      txTo = '';

      mentionedAccounts.push(data.account);

      txInfo_description = 'sellram';
      break;
    }
    case 'updateauth': {
      msgObject.c3 = action.authorization[0].actor;
      msgObject.c4 = `${data.account}@${data.parent}`;
      if (data && data.auth && data.auth.keys.legth > 0) {
        if (data.auth.keys[0].key) {
          msgObject.c5 = data.auth.keys[0].key;
        }
      }

      if (data && data.auth && data.auth.accounts.legth > 0) {
        if (data.auth.accounts[0].actor) {
          msgObject.c6 = data.auth.accounts[0].actor;
        }
      }

      mentionedAccounts.push(action.authorization[0].actor);

      txTo = '';
      txInfo_description = 'updateauth';
      break;
    }
    case 'delegatebw': {
      msgObject.c3 = `${data.from}@${action.account}`;
      msgObject.c4 = `${data.receiver}`;
      msgObject.c5 = `NET:${data.stake_net_quantity}`;
      msgObject.c6 = `CPU:${data.stake_net_quantity}`;

      txTo = '';

      mentionedAccounts.push(data.from);
      mentionedAccounts.push(data.receiver);

      txInfo_description = 'delegatebw';
      break;
    }
    case 'undelegatebw': {
      msgObject.c3 = data.from;
      msgObject.c4 = `${data.receiver}`;
      msgObject.c5 = `NET:${data.unstake_net_quantity}`;
      msgObject.c6 = `CPU:${data.unstake_cpu_quantity}`;

      txTo = '';

      mentionedAccounts.push(data.from);
      mentionedAccounts.push(data.receiver);

      txInfo_description = 'delegatebw';
      break;
    }
    case 'regproducer': {
      msgObject.c3 = data.producer;
      msgObject.c4 = data.url;
      msgObject.c5 = data.location;
      msgObject.c6 = '';

      txTo = '';
      mentionedAccounts.push(data.producer);
      txInfo_description = 'regproducer';
      break;
    }
    case 'voteproducer': {
      msgObject.c3 = `${data.voter} `;
      if (data.proxy !== '') {
        msgObject.c3 = `${data.proxy} [Proxy]`;
        mentionedAccounts.push(data.proxy);
      }

      let voteProds = '';
      mentionedAccounts.push(
        ...data.producers.map(item => {
          if (voteProds !== '') {
            voteProds += ', ';
          }
          voteProds += item;
          return item;
        }),
      );

      mentionedAccounts.push(data.voter);

      msgObject.c4 = voteProds;
      msgObject.c5 = '';
      msgObject.c6 = '';

      txTo = '';
      txInfo_description = 'voteproducer';
      break;
    }
    case 'setram': {
      msgObject.c3 = account;
      msgObject.c4 = data.max_ram_size;
      msgObject.c5 = '';
      msgObject.c6 = '';

      txTo = '';
      txInfo_description = 'regproducer';
      break;
    }

    case 'claimrewards': {
      msgObject.c3 = actor;
      msgObject.c4 = data.owner;
      msgObject.c5 = '';
      msgObject.c6 = '';

      txTo = '';

      mentionedAccounts.push(actor);
      mentionedAccounts.push(data.owner);

      txInfo_description = 'claimrewards';
      break;
    }

    default: {
      msgObject.c3 = account;
      msgObject.c4 = JSON.stringify(data)
        .toString()
        .replace(lt, '&lt;')
        .replace(gt, '&gt;')
        .replace(ap, '&#39;')
        .replace(ic, '&#34;');
      msgObject.c5 = '';
      msgObject.c6 = '';

      txTo = '';
      mentionedAccounts.push(account);
      txInfo_description = 'unknown action';
    }
  }

  if (account === 'eosio') {
    switch (name) {
      case 'issue': {
        const issueCurrency = `${data.quantity}`.split(' ');
        issueCurrency[0].replace('.', '');
        issueCurrency[0].replace(',', '');

        const currobj = {};
        msgObject.c3 = `${account}->`;
        msgObject.c4 = data.to;
        msgObject.c5 = data.quantity;
        msgObject.c6 = '';
        if (data.memo) {
          msgObject.c6 = data.memo;
        }
        currobj[`balances.${issueCurrency[1]}`] = issueCurrency[0] * 1;
        mentionedAccounts.push(account);
        mentionedAccounts.push(data.to);

        txTo = data.to;
        txInfo_description = `Issue for ${data.to} ${data.quantity}`;
        break;
      }

      case 'transfer': {
        msgObject.c3 = `${data.from}->`;
        msgObject.c4 = data.to;
        msgObject.c5 = data.quantity;
        msgObject.c6 = (data.memo || '')
          .toString()
          .replace(lt, '&lt;')
          .replace(gt, '&gt;')
          .replace(ap, '&#39;')
          .replace(ic, '&#34;');
        const transferCurrency = `${data.quantity}`.split(' ');
        const currobjto = {};
        const currobjfrom = {};

        let mult = 1;
        if (transferCurrency[1] === 'EOS') {
          mult = 10000;
        }

        currobjto[`balances.${transferCurrency[1]}`] = parseInt(transferCurrency[0] * mult, 10);
        currobjfrom[`balances.${transferCurrency[1]}`] = -1 * parseInt(transferCurrency[0] * mult, 10);

        mentionedAccounts.push(data.from);
        mentionedAccounts.push(data.to);

        txTo = data.to;
        txInfo_description = `From ${data.from} to ${data.to} ${data.quantity} ${data.memo}`;
        break;
      }
      case 'bidname': {
        mentionedAccounts.push(data.bidder);
        mentionedAccounts.push(data.to);

        msgObject.c3 = data.bidder;
        msgObject.c4 = (data.newname || '')
          .toString()
          .replace(lt, '&lt;')
          .replace(gt, '&gt;')
          .replace(ap, '&#39;')
          .replace(ic, '&#34;');
        msgObject.c5 = data.bid;
        msgObject.c6 = '';

        mentionedAccounts.push(data.bidder);
        mentionedAccounts.push(msgObject.c4);

        txTo = '';
        txInfo_description = 'regproducer';
        break;
      }
      default: {
        msgObject.c6 = '';
      }
    }
  }
  const txInfo = {
    txid: id,
    block: block_num,
    account,
    to: txTo,
    action: name,
    date: transaction.expiration,
    description: txInfo_description,
    msgObject,
    mentionedAccounts: uniq(mentionedAccounts),
  };

  if (name === 'voteproducer') {
    const stdout_obj = await eosApi.getAccount({ account_name: data.voter });

    if (stdout_obj.total_resources == null) {
      stdout_obj.total_resources = { ram_bytes: 0, net_weight: '? EOS', cpu_weight: '? EOS' };
    }
    txInfo.msgObject.c5 = `NET: ${stdout_obj.total_resources.net_weight} <BR>CPU: ${
      stdout_obj.total_resources.cpu_weight
    }<BR>`;
    const net = stdout_obj.total_resources.net_weight.split(' ');
    const cpu = stdout_obj.total_resources.cpu_weight.split(' ');

    txInfo.msgObject.c6 = `TOTAL: ${Math.round((net[0] * 1 + cpu[0] * 1) * 10000) / 10000} EOS`;
  }
  result.txInfo = txInfo;
  result.accounts = txInfo.mentionedAccounts;
  return withSubActions ? [result, ...processedSubActions] : result;
};

/**
 * @param block
 * @returns {Promise<void>} [{ txInfo, newAccount (if exists) }]
 */
const exctractTransactions = async ({ transactions, block_num, producer }) => flatten(
  await Promise.all(
    transactions.filter(({ trx: { transaction } }) => transaction).map(async ({ trx: { id, transaction } }) => {
      const { actions } = transaction;

      return flatten(await Promise.all(
        actions.map(processAction({ block_num, transaction, id, producer, withSubActions: true })),
      )).filter(e => e);
    }),
  ),
);

module.exports = exctractTransactions;
