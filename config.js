/*###############################################################################  
# 
# EOS TestNet Monitor 
#
# Created by http://CryptoLions.io  
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
###############################################################################  */

module.exports = {
	eos_monitor_port: "8889",  //This Monitor Port to listen Websockets and http
	nodeAddr: "127.0.0.1:8888", // Your Local node connected to network

	mongoURL: "mongodb://localhost:27017/",  //mongoDB url Path
	mongoDB: "eosbemonitor",  //mongoDB database name

    mainLoopInterval: 100,   //Intervval between noded check
    blockCheckInterval: 50,  //Interval between block parsing
    TelegramCheckInterval: 1000, //Telegram Bot check intervall

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
} 
