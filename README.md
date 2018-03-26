# EOS Testnet monitor
This tool helps monitor EOS BP nodes

To use, change node list in /js/bps.js to your.  
To checge request interval edit /js/check_nodes.js variable var _reqInterval = 500;  


please add line to config.ini for all nodes:  
access-control-allow-origin = *   
to allow access to monitor  
  
Example: http://jungle.cryptolions.io:9898/monitor/

Upd: 2018-03-26
- Small table layout
- Added checking last produced blcok
- Added Time from last production
- Added server version
- Added favicon
- Small code refactoring
