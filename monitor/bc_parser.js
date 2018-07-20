/* ###############################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
############################################################################### */

const request = require("request");
const sleep = require('sleep');

module.exports = {
  init: init,
  reinit: reinit,
  connected: connected,
  disconnected: disconnected,
  getStats: getStats,
  getProducers: getProducers,
  getNodeInfo: getNodeInfo,
  CheckNewBlocksTimer: CheckNewBlocksTimer,
  getBlockInfo: getBlockInfo,
  processBlock: processBlock,
  processTransaction: processTransaction,
  updateSTATS: updateSTATS,
  updateProducer: updateProducer,
  updateAccount: updateAccount,
  addTransactions: addTransactions,
  APIrequest: APIrequest,
  CheckNewTelegramUsers: CheckNewTelegramUsers,
  telegramRequest: telegramRequest,
  updateTelegramUsres: updateTelegramUsres,
  getNodes: getNodes,
  processTelegramUpdate: processTelegramUpdate,
  sendTelegramMessage: sendTelegramMessage,
  nodeDownAlarm: nodeDownAlarm,
  nodeUpNotification: nodeUpNotification,
  getTransactions: getTransactions,
  announceMsg: announceMsg,

  test: 0
}

function reinit() {
  this.STATS = {};
  this.PRODUCERS = {};
  this.TXS = {};

  this.LAST_GETINFG = {};
  this.NODES = [];

  this.statsLoaded = false;
  this.producersLoaded = false;
  this.nodesLoaded = false;

  this.getNodes();
  this.getStats();
  this.getProducers();

  this.nodeDownCount = {};
}

function init(data) {

  this.connections = 0;
  this.connections_data = {};
  this.data = data;
  this.blockProcessing = -1;
  this.LastCheckedNode = -1;
  this.LastCheckedNodePing = {};
  this.LastTelegramNotify = {};
  this.LastTransactions = [];

  this.LastTXLoaded = false;

  this.reinit();

  console.log('===========init() data.CONFIG ===========')
  console.log(this.data.CONFIG)
  console.log('======================')

  this.getNodeInfo(this, this.data.CONFIG.nodeAddr, this.LastCheckedNode);

  this.interval_main_loop = setInterval(mainLoop, this.data.CONFIG.mainLoopInterval, this);
  this.interval_blockcheck = setInterval(CheckNewBlocksTimer, this.data.CONFIG.blockCheckInterval, this);

  if (this.data.CONFIG.TELEGRAM_API.enabled)
    this.interval_telegramm = setInterval(CheckNewTelegramUsers, this.data.CONFIG.TelegramCheckInterval, this);

  //var msgObject = {"c1": blocknum, "c2": action.name};
  var th = this;
  this.getTransactions(this, 0, 6, function(this_, res) {
    th.LastTransactions = res.reverse();
    th.LastTXLoaded = true;
    console.log(res);
  });
  //clearInterval(interval);
}

function mainLoop(this_) {

  if (!this_.statsLoaded)
    return;
  if (!this_.producersLoaded)
    return;
  if (!this_.nodesLoaded)
    return;
  if (!this_.LastTXLoaded)
    return;

  //this_.announceMsg(this_, "console", this_.data.CONFIG.hook);

  this_.LastCheckedNode++;
  if (this_.LastCheckedNode >= this_.NODES.length)
    this_.LastCheckedNode = 0;

  console.log('=======================')
  console.log(this_.NODES)
  console.log('=======================')

  var addr = this_.NODES[this_.LastCheckedNode].node_addr;
  var port = this_.NODES[this_.LastCheckedNode].port_http;

  this_.getNodeInfo(this_, addr + ":" + port, this_.LastCheckedNode);

}

function CheckNewBlocksTimer(this_) {
  if (!this_.statsLoaded)
    return;
  if (!this_.producersLoaded)
    return;
  if (!this_.nodesLoaded)
    return;

  var lastblockinfo = this_.LAST_GETINFG.head_block_num;
  //var lastblockinfo = 9500;

  if (this_.blockProcessing > 0)
    return;

  if (this_.STATS.lastBlock < lastblockinfo) {
    var nextBlocknum = this_.STATS.lastBlock + 1;
    this_.blockProcessing = nextBlocknum;
    this_.getBlockInfo(this_, this_.data.CONFIG.nodeAddr, nextBlocknum);
  }

}

function announceMsg(this_, action, msg) {
  if (this_.connections > 0) {
    var r = -1;
    this_.data.io.emit(action, msg);
    //console.log("OK");
  }
}

function connected(socket) {

  socket.emit("initNodes", this.NODES);

  //console.log(this.NODES);

  this.connections_data[socket.id] = socket;
  this.connections++;

  //socket.emit("blockupdate", this.STATS.lastBlock);
  socket.emit("get_info", this.LAST_GETINFG);
  socket.emit("initProducersStats", this.PRODUCERS);
  this.announceMsg(this, "usersonline", this.connections);

  var ltx = this.LastTransactions;
  for (var t in ltx) {
    socket.emit("transaction", ltx[t].msgObject);
  }

  //console.log('bc_conn '+this.connections);
}

function disconnected(socket) {
  this.connections--;
  delete this.connections_data[socket.id];
  this.announceMsg(this, "usersonline", this.connections);
}

function test() {}

function getNodeInfo(this_, ipaddr, nodeid) {
  console.log('getNodeInfo', this_, ipaddr, nodeid);
  var url = "http://" + ipaddr + this_.data.CONFIG.EOSAPI.api_get_info;
  //var url = "http://127.0.0.1:8898/v1/chain/get_info";
  this_.LastCheckedNodePing[nodeid] = new Date().getTime();

  this_.announceMsg(this_, "ping", {nodeid: nodeid});

  request({
    url: url,
    json: true,
    timeout: 40000
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      //console.log(body);  Print the json response
      this_.LAST_GETINFG = body;
      body.nodeid = nodeid;
      body.ping = new Date().getTime() - this_.LastCheckedNodePing[nodeid];
      body.txs = this_.STATS.total_tx_count;
      body.txblocks = this_.STATS.total_txblocks_count;
      //console.log('Ping: '+body.ping);
      this_.announceMsg(this_, "get_info", body);

      if (this_.data.CONFIG.TELEGRAM_API.enabled && this_.NODES[nodeid]) {
        this_.nodeDownCount[this_.NODES[nodeid].bp_name] = 0;
        this_.nodeUpNotification(this_, this_.NODES[nodeid].bp_name);
      }
    } else {
      this_.announceMsg(this_, "error_node", nodeid);
      //this_.NODES[nodeid].bp_name
      if (this_.data.CONFIG.TELEGRAM_API.enabled) {
        if (!this_.nodeDownCount[this_.NODES[nodeid].bp_name])
          this_.nodeDownCount[this_.NODES[nodeid].bp_name] = 0;

        if (this_.nodeDownCount[this_.NODES[nodeid].bp_name] >= this_.data.CONFIG.TELEGRAM_API.tryToCheckBeforeSend - 1) {
          this_.nodeDownAlarm(this_, this_.NODES[nodeid].bp_name);
          this_.nodeDownCount[this_.NODES[nodeid].bp_name] = 0;
        } else {
          this_.nodeDownCount[this_.NODES[nodeid].bp_name]++;
        }
      }
    }

  });

}

function getBlockInfo(this_, ipaddr, blocknum) {
  var url = "http://" + ipaddr + this_.data.EOSAPI.api_get_block;
  //var url = "http://127.0.0.1:8898/v1/chain/get_info";
  request.post({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    url: url,
    body: '{"block_num_or_id": ' + blocknum + '}',
    json: true
  }, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      this_.processBlock(this_, blocknum, body);
      //console.log(body);  Print the json response
      //this_.LAST_GETINFG = body;

    } else {
      //ERROR BED BLOCK !!!!!!!!!!!!!!
      //console.log("ERROR: "+blocknum);
      this_.STATS.lastBlock = blocknum;
      this_.blockProcessing = -1;

    }
  });

}

function processBlock(this_, blocknum, block) {

  this_.announceMsg(this_, "blockupdate", block);

  //this_.announceMsg(this_, "chat message", JSON.stringify(block) );

  this_.STATS.lastBlock = block.block_num;
  //this_.STATS.lastIrrBlock = block.
  //this_.STATS.lastProducer = block.producer
  //this_.STATS.lastDate = block.timestamp
  //console.log(block);

  if (this_.PRODUCERS[block.producer]) {
    this_.PRODUCERS[block.producer].produced += 1;
    this_.PRODUCERS[block.producer].tx_count += block.input_transactions.length;
    this_.PRODUCERS[block.producer].tx_sum += 0; //!!!! ADD SUMS
  } else {
    this_.PRODUCERS[block.producer] = {};
    this_.PRODUCERS[block.producer].produced = 1;
    this_.PRODUCERS[block.producer].tx_count = block.input_transactions.length;
    this_.PRODUCERS[block.producer].tx_sum = 0; //!!!! ADD SUMS
  }

  this_.updateProducer(this_, block.producer, {
    name: block.producer,
    produced: this_.PRODUCERS[block.producer].produced,
    tx_count: this_.PRODUCERS[block.producer].tx_count,
    tx_sum: this_.PRODUCERS[block.producer].tx_sum
  });
  this_.announceMsg(this_, "blockprod_update", this_.PRODUCERS[block.producer]);

  if (block.input_transactions.length > 0) {
    this_.STATS.total_txblocks_count++;

    this_.STATS.total_tx_count += block.input_transactions.length;

    this_.processTransaction(this_, block.block_num, block);

    //console.log(this_.PRODUCERS);
    //console.log('-----------------------------');
    //console.log(block.input_transactions);
    //console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    //console.log(block.input_transactions[0].data.actions);
    //console.log('==============================');
    //console.log(JSON.stringify(block.input_transactions));
    //console.log('');
    ///console.log('');

  }

  this_.updateSTATS(this_);

}

function processTransaction(this_, blocknum, block) {
  //console.log(txs);
  var txs = block.input_transactions;
  //var txs_id =block.regions[0];

  for (var t in txs) {
    var txs_id = "";

    if (block.regions[0] && block.regions[0].cycles_summary[1] && block.regions[0].cycles_summary[1][0].transactions)
      txs_id = block.regions[0].cycles_summary[1][0].transactions[t].id;

    var tx = txs[t].transaction;
    var actions = tx.actions;

    for (var a in actions) {
      var action = actions[a];
      //action.account
      //action.name  setcode, setabi, newaccount, issue, transfer
      a_data = action.data; //obj
      //console.log(action.name);

      var msgObject = {
        "c1": blocknum,
        "c2": action.name
      };

      var updAccount = {};
      var txInfo_description = "";
      var txTo = "";
      var tx_data = {};

      switch (action.name) {
        case 'setcode':
          msgObject.c3 = action.account;
          msgObject.c4 = "->";
          msgObject.c5 = a_data.account;
          msgObject.c6 = "smart contract for " + a_data.account
          //updAccount = { $push: {"transactions": {"action": action.name, "block":blocknum}}};
          txTo = a_data.account;
          tx_data = {};

          txInfo_description = "smart contract";
          break;
        case 'setabi':
          msgObject.c3 = action.account;
          msgObject.c4 = "->";
          msgObject.c5 = a_data.account;
          msgObject.c6 = "smart contract for " + a_data.account;

          txTo = a_data.account;
          txInfo_description = "smart contract";
          tx_data = {};
          //var updAccount = { $push: {"transactions": {"action": action.name, "block":blocknum}}};
          break;
        case 'newaccount':
          msgObject.c3 = a_data.creator;
          msgObject.c4 = "->";
          msgObject.c5 = a_data.name;
          msgObject.c6 = "";
          //var newAcc = { "name": a_data.name, "createdby": a_data.creator, "date":tx.expiration, "balances": {"EOS": 0}, "accounts": [], "transactions": [] };
          var newAcc = {
            "name": a_data.name,
            "createdby": a_data.creator,
            "date": tx.expiration,
            "balances": {
              "EOS": 0
            },
            "accounts": []
          };
          this_.updateAccount(this_, a_data.name, newAcc);

          //updAccount = { $push: {"transactions": {"action": action.name+' - '+a_data.name, "block":blocknum}, "accounts": {"name": a_data.name, "block": blocknum} }};
          updAccount = {
            $push: {
              "accounts": {
                "name": a_data.name,
                "block": blocknum
              }
            }
          };
          this_.updateAccount(this_, action.account, updAccount);

          txTo = a_data.name;
          txInfo_description = a_data.creator + " created account for " + a_data.name;
          tx_data = a_data;
          break;

        case 'setprods':
          msgObject.c3 = action.account;
          msgObject.c4 = "producers:";
          var newProds = "";
          for (var pp in a_data.producers)
            newProds += a_data.producers[pp].producer_name + ", "
          msgObject.c5 = newProds;
          msgObject.c6 = "";

          txTo = "";
          txInfo_description = "new producers:" + newProds;
          tx_data = a_data;
          //console.log(msgObject);

          break;
        case 'create':
          if (!action.authorization[0].actor)
            action.authorization[0].actor = "";
          if (!a_data.issuer)
            a_data.to = "";
          if (!a_data.maximum_supply)
            a_data.to = "";

          msgObject.c3 = action.authorization[0].actor + "@" + action.account;
          msgObject.c4 = "Issue";
          msgObject.c5 = a_data.issuer;
          msgObject.c6 = a_data.maximum_supply;

          txTo = a_data.issuer;
          txInfo_description = "Token Create issuer";
          tx_data = a_data;

          //console.log(msgObject);

          break;

        case 'issue':
          msgObject.c3 = action.authorization[0].actor + "@" + action.account;
          if (!a_data.to)
            a_data.to = "";
          if (!a_data.quantity)
            a_data.to = "";
          if (!a_data.memo)
            a_data.to = "";
          msgObject.c4 = ">" + a_data.to;
          msgObject.c5 = a_data.quantity;
          msgObject.c6 = a_data.memo;
          var currency = (a_data.quantity + "").split(" ");
          //console.log(msgObject);
          txTo = a_data.to;
          txInfo_description = "Token issue Funds";
          tx_data = a_data;
          break;

        case 'transfer':
          if (!action.authorization[0].actor)
            action.authorization[0].actor = "";
          if (!a_data.from)
            a_data.from = "";
          if (!a_data.to)
            a_data.to = "";
          if (!a_data.quantity)
            a_data.quantity = "";
          if (!a_data.memo)
            a_data.memo = "";

          msgObject.c3 = action.authorization[0].actor + "@" + action.account;
          msgObject.c4 = a_data.from + ">" + a_data.to;
          msgObject.c5 = a_data.quantity;
          msgObject.c6 = a_data.memo;
          var currency = (a_data.quantity + "").split(" ");

          txTo = a_data.to;
          txInfo_description = "Token transfer";
          tx_data = a_data;
          //console.log(msgObject);

          break;

        case 'getbalance':
          msgObject.c3 = action.authorization[0].actor + "@" + action.account;
          msgObject.c4 = "owner";
          msgObject.c5 = a_data.owner;
          msgObject.c6 = "";

          txTo = "";
          txInfo_description = "Token getbalance";
          tx_data = a_data;
          //console.log(msgObject);

          break;

        default:
          msgObject.c3 = action.account;
          msgObject.c4 = "..."
          msgObject.c5 = "..";
          msgObject.c6 = "..";

          txTo = "";
          txInfo_description = "unknown action";
          tx_data = a_data;

      }

      if (action.account == "eosio") {
        switch (action.name) {
          case 'issue':
            msgObject.c3 = action.account + "->";
            msgObject.c4 = a_data.to;
            msgObject.c5 = a_data.quantity;
            msgObject.c6 = "";
            if (a_data.memo)
              msgObject.c6 = a_data.memo;

            var currency = (a_data.quantity + "").split(" ");
            currency[0].replace(".", "");
            currency[0].replace(",", "");

            var currobj = {};
            currobj["balances." + currency[1] + ""] = currency[0] * 1;

            var updAccount2 = {
              $inc: currobj
            };
            this_.updateAccount(this_, a_data.to, updAccount2);

            txTo = a_data.to;
            txInfo_description = "Issue for " + a_data.to + " " + a_data.quantity;
            tx_data = a_data;
            //this_.updateAccountbalance(action.name, a_data);
            break;
          case 'transfer':
            msgObject.c3 = a_data.from + "->";
            msgObject.c4 = a_data.to;
            msgObject.c5 = a_data.quantity;
            msgObject.c6 = a_data.memo;
            var currency = (a_data.quantity + "").split(" ");
            //console.log(msgObject);
            var currobjto = {};
            var currobjfrom = {};

            var mult = 1;
            if (currency[1] == "EOS")
              mult = 10000;

            currobjto["balances." + currency[1] + ""] = parseInt(currency[0] * mult);
            currobjfrom["balances." + currency[1] + ""] = -1 * parseInt(currency[0] * mult);
            //console.log(currobj);
            //var updAccount = { $push: {"transactions": {"action": action.name+' to '+a_data.to, "block":blocknum}}, $inc: currobjfrom };
            updAccount = {
              $inc: currobjfrom
            };
            this_.updateAccount(this_, action.account, updAccount);

            //var updAccount2 = { $push: {"transactions": {"action": action.name+' from '+a_data.from, "block":blocknum}}, $inc: currobjto };
            var updAccount2 = {
              $inc: currobjto
            };
            this_.updateAccount(this_, a_data.to, updAccount2);

            txTo = a_data.to;
            txInfo_description = "From " + a_data.from + " to " + a_data.to + " " + a_data.quantity + " " + a_data.memo;
            tx_data = a_data;
            //this_.updateAccountbalance(action.name, a_data);
            //console.log(a_data);
            break;

        }
      }

      //var txInfo = {txid: txs_id, "block": blocknum, "account": action.account, "to": txTo, "action": action.name, "date": tx.expiration, "data": tx_data, "description": txInfo_description, "msgObject":msgObject};
      var txInfo = {
        txid: txs_id,
        "block": blocknum,
        "account": action.account,
        "to": txTo,
        "action": action.name,
        "date": tx.expiration,
        "data": {},
        "description": txInfo_description,
        "msgObject": msgObject
      };
      this_.addTransactions(this_, txInfo);

      //this_.LastTransactions.unshift(txInfo);
      this_.LastTransactions.push(txInfo);
      if (this_.LastTransactions.length > 8) {
        this_.LastTransactions.shift();
      }

      this_.announceMsg(this_, "transaction", msgObject);

      //var newvalues = { $set: updValue, $inc: updAcc  };     {"balances.EOS"}

      //setcode: account, code
      //setabi: account, abi
      //newaccount: creator, name, owner[{key, weight}], active[{key, weight}], recovery [{}]
      //issue: to, quantity
      //transfer: from, to, quantity, memo

    }
    //tx.ref_block_num

  }

}

function updateSTATS(this_) {
  var newvalues = {
    $set: this_.STATS
  };
  var th = this_;
  this_.data.dbo.collection("stats").updateOne({
    id: 1
  }, newvalues, {
    upsert: true
  }, function(err, res) {
    if (err)
      throw err;

    //console.log("1 document updated");
    this_.blockProcessing = -1;
    //th.data.db.close();
  });

}

function updateProducer(this_, name, data) {

  var newvalues = {
    $set: data
  };
  var th = this_;
  this_.data.dbo.collection("producers").update({
    name: name
  }, newvalues, {upsert: true});

}

function updateAccount(this_, name, data) {
  //var newvalues = { $set: data };
  var th = this_;
  this_.data.dbo.collection("accounts").update({
    name: name
  }, data, {upsert: true});
}

function addTransactions(this_, data) {
  //var newvalues = { $set: data };
  //var th = this_;
  this_.data.dbo.collection("transactions").insert(data);
}

function getStats() {
  var th = this;

  this.data.dbo.collection("stats").findOne({
    id: 1
  }, function(err, result) {
    if (err)
      throw err;

    if (!result)
      result = {
        id: 1,
        lastBlock: 0,
        total_tx_count: 0,
        total_txblocks_count: 0,
        tx_sum: 0,
        lastTelegramUpd_last: 0
      };
    th.STATS = result;
    th.statsLoaded = true;

  });
}

function getProducers() {
  var th = this;

  this.data.dbo.collection("producers").find({}).toArray(function(err, result) {
    if (err)
      throw err;

    //th.PRODUCERS = result;
    for (var k in result) {
      th.PRODUCERS[result[k].name] = result[k];
    }
    //console.log(th.PRODUCERS);
    th.producersLoaded = true;

    th.announceMsg(th, "initProducersStats", th.PRODUCERS);
  });
}

function getNodes() {
  var th = this;

  this.data.dbo.collection("nodes").find({}).sort({"_id": 1}).toArray(function(err, result) {
    if (err)
      throw err;
    th.NODES = result;
    th.nodesLoaded = true;

    th.announceMsg(th, "initNodes", th.NODES);

    //th.socket.emit("initNodes", th.NODES);
    //console.log(th.NODES);

  });
}

function getTransactions(this_, page, countPerPage, callback) {

  var th = this_;

  this.data.dbo.collection("transactions").find({}).sort({"_id": -1}).skip(page * countPerPage).limit(countPerPage).toArray(function(err, result) {
    callback(th, result);
  });
}

function APIrequest(msg, socket) { //data = '{"block_num_or_id": '+blocknum+'}'
  var url = "http://" + this.data.CONFIG.nodeAddr + msg.api;

  //console.log(msg);
  //var url = "http://127.0.0.1:8898/v1/chain/get_info";
  this.data.request.post({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    url: url,
    body: msg.data,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      socket.emit("api", body);
    } else {
      socket.emit("api", "error");
    }
  });
}

//--------------Telegarmm

function CheckNewTelegramUsers(this_) {
  //this.data.CONFIG.Telegram
  var request_data = {
    url: this_.data.CONFIG.TELEGRAM_API.getUpdates(),
    data: ""
  };
  this_.telegramRequest(request_data, this_, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      //this_.announceMsg(this_, "console", body);

      this_.processTelegramUpdate(body.result, this_);
      //updateTelegramUsres(this_, chatid, data)

      //socket.emit("api", body);

    } else {
      //socket.emit("api", "error");
    }
  });
}

function processTelegramUpdate(data, this_) {
  var data_upd;

  if (!this_.STATS.lastTelegramUpd_last)
    this_.STATS.lastTelegramUpd_last = 0;

  for (var i in data) {
    //console.log(data[i].message);
    //console.log(this_.STATS.lastTelegramUpd_last +" < "+  data[i].update_id);

    if (this_.STATS.lastTelegramUpd_last < data[i].update_id * 1) {
      this_.STATS.lastTelegramUpd_last = data[i].update_id * 1;
      //data[i].message.message_id
      //{fname: ,lname: ,username, lang: , producer, enabled}

      //data[i].message.chat.id

      var text_cmd = data[i].message.text;
      var cmd_arr = text_cmd.split(" ");

      var producers_ = [];
      var enabled = false;
      var isCmd = false;
      if (cmd_arr.length > 1)
        if (cmd_arr[0] == "/init") {
          isCmd = true;
          var names = "";
          for (var j = 1; j < cmd_arr.length; j++) {
            producers_.push(cmd_arr[j]);
            names += cmd_arr[j] + ", ";
          }
          enabled = true;

          data_upd = {
            $set: {
              chatid: data[i].message.chat.id,
              first_name: data[i].message.chat.first_name,
              last_name: data[i].message.chat.last_name,
              username: data[i].message.chat.username,
              producer_name: producers_,
              enabled: enabled
            }
          };
          this_.updateTelegramUsres(this_, data[i].message.chat.id, data_upd);

          this_.sendTelegramMessage(this_, data[i].message.chat.id, "Your nodes [" + names + "] added to EOS Jungle monitor notification system. \nThank You. To disable type: /disable" + "");
        }
      if (cmd_arr.length > 0) {
        if (cmd_arr[0] == "/enable") {
          isCmd = true;
          data_upd = {
            $set: {
              chatid: data[i].message.chat.id,
              enabled: true
            }
          }
          this_.updateTelegramUsres(this_, data[i].message.chat.id, data_upd);
          this_.sendTelegramMessage(this_, data[i].message.chat.id, "Notification System Enabled. ");
        }
        if (cmd_arr[0] == "/disable") {
          isCmd = true;
          data_upd = {
            $set: {
              chatid: data[i].message.chat.id,
              enabled: false
            }
          }
          this_.updateTelegramUsres(this_, data[i].message.chat.id, data_upd);
          this_.sendTelegramMessage(this_, data[i].message.chat.id, "Notification System Disabled.");
        }
        if (!isCmd) {
          this_.sendTelegramMessage(this_, data[i].message.chat.id, "/init <producerName1> [<producerName2> .. ]  - Intit notification for your producers \n/enable - Enable notification for init producers \n/disable - Disable notification for init producers \n/help - This screen ");

        }
      }

      //console.log(data);
      //this_.announceMsg(this_, "console", data_upd);

    }
  }

}

function nodeUpNotification(this_, node_name) {

  if (this_.LastTelegramNotify[node_name] > 0) {
    this_.data.dbo.collection("telegram").find({
      producer_name: {
        $in: [node_name]
      }
    }).toArray(function(err, result) {
      for (var k in result) {
        if (result[k].enabled) {

          this_.sendTelegramMessage(this_, result[k].chatid, "You node <b>" + node_name + "</b> is <b>UP</b> again. Thank you " + result[k].first_name + "&parse_mode=html");
          this_.LastTelegramNotify[node_name] = 0;
        }
      }
    });

  }

}

function nodeDownAlarm(this_, node_name) {
  var th = this_;

  this_.data.dbo.collection("telegram").find({
    producer_name: {
      $in: [node_name]
    }
  }).toArray(function(err, result) {
    if (err)
      throw err;

    for (var k in result) {
      if (result[k].enabled) {
        if (!this_.LastTelegramNotify[node_name])
          this_.LastTelegramNotify[node_name] = 0;

        if (new Date().getTime() - this_.LastTelegramNotify[node_name] > th.data.CONFIG.TELEGRAM_API.intervalBetweenMsg * 1000) {
          this_.LastTelegramNotify[node_name] = new Date().getTime();
          th.sendTelegramMessage(th, result[k].chatid, "Hi " + result[k].first_name + ",  you node <b>" + node_name + "</b> seems to be <b>DOWN</b>. Please take a look. Thanks in advanced.&parse_mode=html");
        }
      }
    }
  });

}

function sendTelegramMessage(this_, chatid, msg) {

  var telegr_msg = {
    url: this_.data.CONFIG.TELEGRAM_API.sendMessage(),
    data: 'chat_id=' + chatid + '&text=' + msg + ''
  };
  //var telegr_msg = 'chat_id='+chatid+'&text='+msg;
  //console.log(telegr_msg);
  this_.telegramRequest(telegr_msg, this_, function(error, response, body) {});

}

function telegramRequest(data, this_, calbback) {

  //console.log(data.url);
  request.post({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    url: data.url,
    body: data.data,
    json: true
  }, function(error, response, body) {
    calbback(error, response, body);

  });
}

function updateTelegramUsres(this_, chatid, data) {
  //var newvalues = { $set: data };
  var th = this_;
  this_.data.dbo.collection("telegram").update({
    chatid: chatid
  }, data, {upsert: true});
}

function countObj(obj) {
  return Object.keys(obj).length;
}
