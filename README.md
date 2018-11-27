# EOS Network monitor 2.0
Simple tool to monitor EOS testnet nodes.
 

Please add line to config.ini for all nodes:  
access-control-allow-origin = *   
to allow access to monitor  
  
Monitor example: http://eosnetworkmonitor.io  


Installing Nodejs v10  and MongoDB  
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -    
sudo apt-get install -y nodejs  
sudo apt-get install mongodb  
```

Backend repo: https://github.com/CryptoLions/EOS-Network-monitor/tree/master/netmon-backend  
Frontend repo: https://github.com/CryptoLions/EOS-Network-monitor/tree/master/netmon-frontend  
 
# Creators  
WebSite: http://cryptolions.io/    
GitGub: https://github.com/CryptoLions  
SteemIt: https://steemit.com/@cryptolions 

## Release notes

v2.0-d2018.11.26
  - Main Table
    - Actual income
    - Expected income
    - Missed Blocks (all time) (last round) (last 24 hours)
    - Vote rewards
    - Block rewards
    - Public endpoints
    - Ping From Europe, Answered colors 
    - Rows colors
    - Blacklist Hash

  - General info
    - Ram used / in chain (Gb) 
    - eosio Ram fee, eosio Saving
    - New TPS/APS calculation

  - Top menu
    - New API (JSON object under API)
    - P2P list
    - Ram price chart
    - Live TPS

  - Other 
    - Move to SSL
    - Updated Readme
    - Producers table update (socket) - speed up
    - Tokens balance for Account info
    - New logo
    - Change language on Top
    - updated Legend
    - logos for all BPs
    - Location flags
    - Left table of unreg BPs for last 24 hours (table appear only if > 1BP)

