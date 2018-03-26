# EOS Testnet monitor
Simple tool to monitor EOS testnet BP node.

To use, change node list in /js/bps.js to your.  
To change request interval edit file /js/check_nodes.js   
and modify variable var _reqInterval = 500; 


please add line to config.ini for all nodes:  
access-control-allow-origin = *   
to allow access to monitor  
  
Example: http://jungle.cryptolions.io:9898/monitor/

# Creators
WebSite: http://cryptolions.io/  
GitGub: https://github.com/CryptoLions  
SteemIt: https://steemit.com/eos/@cryptolions/crypto-lions-eos-block-producer-candidates#comments  

# Updates
Upd: 2018-03-26
- Small table layout
- Added checking last produced blcok
- Added Time from last production
- Added server version
- Added node version
- Added favicon
- Small code refactoring
