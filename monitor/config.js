/*###############################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
###############################################################################  */

const ENV = process.env;
const mongoHost = ENV['MONGO_HOST'] || 'localhost';
const mongoPort = ENV['MONGO_PORT'] || '27017';
const config = {
	eos_monitor_port: ENV['EOS_MONITOR_PORT'] || "4000",  //This Monitor Port to listen Websockets and http
	nodeAddr: ENV['TESTNET_NODE_ADDRESS']|| "127.0.0.1:8888", // Your Local node connected to network
	mongoURL: `mongodb://${mongoHost}:${mongoPort}/`,//mongoDB url Path
	mongoDB: ENV['MONGO_DB_NAME'] || "eosbemonitor",  //mongoDB database name
	mainLoopInterval: 100,   //Intervval between noded check
	blockCheckInterval: 50,  //Interval between block parsing
	TelegramCheckInterval: 1000, //Telegram Bot check interval

	EOSAPI : {
		api_get_info: "/v1/chain/get_info",
		api_get_block: "/v1/chain/get_block"
	},

	TELEGRAM_API: {
		enabled: true,
		telegram_ID: "12345678:AF3e3asf-FSOFHRFIHF",  //telegrem bot ID
		tryToCheckBeforeSend: 3,  // How many error loops before send
		intervalBetweenMsg: 900,  //900sec = 15minutes

		telegramURL: "https://api.telegram.org/bot",
		getUpdates: function() {return this.telegramURL + this.telegram_ID + "/getUpdates";},  // "https://api.telegram.org/bot"+telegram_ID+"/getUpdates",
		sendMessage: function() {return this.telegramURL + this.telegram_ID + "/sendMessage";}  //"https://api.telegram.org/bot"+telegram_ID+"/sendMessage"
	}
};

module.exports = config;
