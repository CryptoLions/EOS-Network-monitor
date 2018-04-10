# EOS Testnet monitor
Simple tool to monitor EOS testnet nodes.
 
 Its new Brunch for server side Monitor (Nodejs+MongoDB+Socket.io) which will reduce requests to server.
 Simple old version you can find here: https://github.com/CryptoLions/EOS-Testnet-monitor/tree/v0.1


Please add line to config.ini for all nodes:  
access-control-allow-origin = *   
to allow access to monitor  
  
Monitor example: http://jungle.cryptolions.io:9898/monitor/  
# Features
- Fast nodes status monitor
- Telegram bot @JungleTestnet_bot to get notification on node crash. 
- Auto generated server peer list
- Last transaction monitor.
- Simple node API


# How to install and Use
Will be update shortly
1. Installing Nodejs v8
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

2. Create project Dir and install modules
cd /var/www
git clone https://github.com/CryptoLions/EOS-Testnet-monitor.git
cd EOS-Testnet-monitor
npm install

3. edit config.js and html/config.js




# Creators
WebSite: http://cryptolions.io/  
GitGub: https://github.com/CryptoLions  
SteemIt: https://steemit.com/@cryptolions 

