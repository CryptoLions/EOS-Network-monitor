# EOS Testnet monitor
Simple tool to monitor EOS testnet BP node.

To use, change node list in /js/bps.js to your.  
To change request interval edit file /js/check_nodes.js   
and modify variable var _reqInterval = 500; 


please add line to config.ini for all nodes:  
access-control-allow-origin = *   
to allow access to monitor  
  
Example: http://jungle.cryptolions.io:9898/monitor/
DAWN3-ALPHA: http://jungle.cryptolions.io:9898/monitor2/

# Creators
WebSite: http://cryptolions.io/  
GitGub: https://github.com/CryptoLions  
SteemIt: https://steemit.com/@cryptolions 

# Updates
Upd: 2018-03-30
- fix view for mobile

Upd: 2018-03-28
- Small design fixes for better view
- Month showing fix in last block date

Upd: 2018-03-26
- Small table layout
- Added checking last produced blcok
- Added Time from last production
- Added server version
- Added node version
- Added favicon
- Small code refactoring
