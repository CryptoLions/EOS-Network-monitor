# EOS Jungle TestNet Monitor

A web based monitor for EOS.IO networks.

Demo: http://jungle.cryptolions.io:9898/monitor/

## Features

- Fast network status monitor.
- Telegram bot @JungleTestnet_bot to get notification on node crash.   
- Auto generated server peer list.
- Last transaction monitor.  
- Simple node API.

## Tech Stack

- Linux
- Node.js
- MongoDB
- Socket.io

## EOS Nodes Configuration Requirements

Please make sure that `access-control-allow-origin = *` is setup on all node APIs servers.

## Configuration

1. Installing Node.js v10 and MongoDB  

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -    
sudo apt-get install -y nodejs  
sudo apt-get install mongodb  
```

2. Create project dir and install modules   

```
cd /var/www   
git clone https://github.com/CryptoLions/EOS-Testnet-monitor.git   
cd EOS-Testnet-monitor   
npm install   
chmod 700 start.sh  
chmod 700 stop.sh  
```

3. edit `config.js` and `html/config.js`

4. Create Telegram Bot Using @BotFather and use authorization token and add to config  

5. To update Nodes List lets use web MongoDB for example admin Mongo:  

```
cd /var/www  
git clone https://github.com/mrvautin/adminMongo.git  
cd adminMongo  
npm install  
edit file config/app.json to edit your webmongo db port and password  
```

```
{
  "app": {  
    "host": "0.0.0.0",  
    "port": 5000,  
    "password": "my_webadmin_pass",  
    "locale": "en",  
    "context": "dbApp",  
    "monitoring": false  
  }  
}  
```

to start serrivce in folder `/var/wwwadminMongo` run:  
`node app`

After start you can access service by url: http://your-server.srv:5000/dbApp/  

On service webpage Create new connection: eosbemonitor   
Connection string: mongodb://127.0.0.1:27017/eosbemonitor  
and connect to this db.  
Create new Collection "nodes" and import in this collection edited nodes list   

```json
[  
 {  
     "bp_name": "<producer_name>",   
     "organisation": "CryptoLions",  
     "location": "Ukraine",  
     "node_addr": "<NODE_IP/DPMAIN>",  
     "port_http": "<NODE_HTTP PORT>",  
     "port_ssl": "",  
     "port_p2p": "<NODE_P2P PORT>",  
     "pub_key": "<EOS_PRODUCER_PUBLIC_KEY>",  
     "bp": true,  
     "enabled": true,  
     "comment": ""  
 },  
  {  
     "bp_name": "<producer_name>",  
     "organisation": "CryptoLions",  
     "location": "Ukraine",  
     "node_addr": "<NODE_IP/DPMAIN>",  
     "port_http": "<NODE_HTTP PORT>",  
     "port_ssl": "",  
     "port_p2p": "<NODE_P2P PORT>",  
     "pub_key": "<EOS_PRODUCER_PUBLIC_KEY>",  
     "bp": true,  
     "enabled": true,  
     "comment": ""  
 }  
]  
```

6. Running Monitor  
```
cd /var/www/EOS-Testnet-monitor  
./start.sh  
```

Monitor will start syncing and add records to db.. You can open your monitor by link `http://\<yourserver\>:4000`

or link html folder to your webserver forlder: `ln -s /var/www/EOS-Testnet-monitor/html /var/www/html/monitor`  

## Creators  

WebSite: http://cryptolions.io/    
GitGub: https://github.com/CryptoLions  
SteemIt: https://steemit.com/@cryptolions

## Old Version

This is the old client side version v0.1 https://github.com/CryptoLions/EOS-Testnet-monitor/tree/v0.1
