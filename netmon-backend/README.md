# EOS Monitor Back

**Base**
- [Description](#description)
- [Packages](#packages)
- [Documentation](#documentation)

**Running the Project**
- [Server](#server)

**Code**
- [Folder Structure](#folder-structure)

***

## Base

### Description

- Node.js app with Express.js. Contains two parts:
    - app (endpoints and sockets)
    - routines (blocks and data handling)

### Packages

Pay attention on:
- config.js (https://www.npmjs.com/package/config)
- express (https://www.npmjs.com/package/express)
- socket.io (https://www.npmjs.com/package/socket.io)
- eosjs-api (https://www.npmjs.com/package/eosjs-api)
- mongoose (https://www.npmjs.com/package/mongoose)
- budsnag (https://www.npmjs.com/package/bugsnag)

_See `package.json` file._


### Documentation

- this `README` file
- source code
- API
    - metric
        - /appmetrics-dash/ - display Node.js application data as a html web application.
        https://github.com/RuntimeTools/appmetrics-dash
    - v1
        - API_PREFIX/table/ - returns current state of the producers table.
        For example [{"name":"eos42freedom","totalVotes":332004228560592700,"organizationUrl":"https://www.eos42.io","key":"EOS4tw7vH62TcVtMgm2tjXzn9hTuHEBbGPUK2eos42ssY7ip4LTzu","produced":709035,"tx_count":19959236,"votesPercentage":2.243740551135519,"votesInEOS":78378746.13227776,"isNode":3,"nodes":[{"enabled":true,"downtimes":[],"_id":"5b7a7758ecf5d80972b0327c","bp_name":"eos42freedom","organisation":"EOS42","location":"KY,Cayman Islands","http_server_address":null,"p2p_listen_endpoint":"seed1.eos42.io:9876","https_server_address":null,"p2p_server_address":"seed1.eos42.io:9876","pub_key":"EOS4tw7vH62TcVtMgm2tjXzn9hTuHEBbGPUK2eos42ssY7ip4LTzu","bp":true}],"rewards_per_day":874.2580085055899,"lastGoodAnsweredTime":"2018-08-20T08:13:59.679Z","isUpdated":false,"isCurrentNode":false,"ping":68,"isNodeBroken":false,"requestTS":1534752839611,"version":"b8c1b2c2","answeredBlock":12077667,"isUnsynced":false,"answeredTimestamp":1534752839679,"producedBlock":12077536,"producedTimestamp":1534752773500}]
        - API_PREFIX/blocks/:number/ - returns info about the block.
        For example {"timestamp":"2018-06-08T08:08:08.500","producer":"","confirmed":1,"previous":"0000000000000000000000000000000000000000000000000000000000000000","transaction_mroot":"0000000000000000000000000000000000000000000000000000000000000000","action_mroot":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906","schedule_version":0,"new_producers":null,"header_extensions":[],"producer_signature":"SIG_K1_111111111111111111111111111111111111111111111111111111111111111116uk5ne","transactions":[],"block_extensions":[],"id":"00000001405147477ab2f5f51cda427b638191c66d2c59aa392d5c2c98076cb0","block_num":1,"ref_block_prefix":4126519930}
        - API_PREFIX/accounts/:name/ - returns info about the account
        For example {"account_name":"cryptolions1","head_block_num":12088139,"head_block_time":"2018-08-20T09:41:41.500","privileged":false,"last_code_update":"1970-01-01T00:00:00.000","created":"2018-06-10T13:04:13.500","core_liquid_balance":"13984.6735 EOS","ram_quota":8146,"net_weight":110000,"cpu_weight":910000,"net_limit":{"used":105,"available":7505611,"max":7505716},"cpu_limit":{"used":7674,"available":1631663,"max":1639337},"ram_usage":7400,"permissions":[{"perm_name":"active","parent":"owner","required_auth":{"threshold":1,"keys":[{"key":"EOS6GDCRCFzDCb3cz5esvpGKyf681jeyGDd46vi4Zq8pLkK6npY8R","weight":1}],"accounts":[],"waits":[]}},{"perm_name":"owner","parent":"","required_auth":{"threshold":1,"keys":[{"key":"EOS6GDCRCFzDCb3cz5esvpGKyf681jeyGDd46vi4Zq8pLkK6npY8R","weight":1}],"accounts":[],"waits":[]}}],"total_resources":{"owner":"cryptolions1","net_weight":"11.0000 EOS","cpu_weight":"91.0000 EOS","ram_bytes":8146},"self_delegated_bandwidth":{"from":"cryptolions1","to":"cryptolions1","net_weight":"10.0000 EOS","cpu_weight":"90.0000 EOS"},"refund_request":null,"voter_info":{"owner":"cryptolions1","proxy":"","producers":[],"staked":1160000,"last_vote_weight":"0.00000000000000000","proxied_vote_weight":"0.00000000000000000","is_proxy":0},"balance":"13984.6735 EOS"}
        - API_PREFIX/accounts/:name/history?skip=0&limit=10
        For example [{"_id":"39996257b9d54ff989cc3c755de94afe22da5d1733026faad11350ceeae61a52","id":"5b7a89a8ecf5d80972e4319a","msgObject":{"c1":"12048781","c2":"voteproducer","c3":"g43tanrwgege ","c4":"cryptolions1, eosafricaone, eosamsterdam, eosantpoolbp, eosauthority, eoscanadacom, eoscybexiobp, eoseouldotio, eosisgravity, eoslaomaocom, eosliquideos, eosmesodotio, eosmetaliobp, eosmotioneos, eosnewyorkio, eosorangeeos, eossixparkbp, eosteaeostea, eostitanprod, eosukblocpro, eosyskoreabp, geosoneforbp, strongmonkey, teamgreymass, voldemorteos","c5":"NET: 3022.8212 EOS <BR>CPU: 4022.8211 EOS<BR>","c6":"TOTAL: 7045.6423 EOS"},"mentionedAccounts":["cryptolions1","eosafricaone","eosamsterdam","eosantpoolbp","eosauthority","eoscanadacom","eoscybexiobp","eoseouldotio","eosisgravity","eoslaomaocom","eosliquideos","eosmesodotio","eosmetaliobp","eosmotioneos","eosnewyorkio","eosorangeeos","eossixparkbp","eosteaeostea","eostitanprod","eosukblocpro","eosyskoreabp","geosoneforbp","strongmonkey","teamgreymass","voldemorteos","g43tanrwgege"],"txid":"39996257b9d54ff989cc3c755de94afe22da5d1733026faad11350ceeae61a52","block":12048781,"account":"eosio","to":"","action":"voteproducer","date":"2018-08-20T04:12:40.000Z","description":"voteproducer","createdAt":"2018-08-20T09:28:08.409Z"}]
        - API_PREFIX/transactions?actions=voteproducer,issue&mentionedAccounts=cryptolions1,bitfinexeos1&tsStart=1533658816000&tsEnd=1534758816000 returns list of transactions
        Where: actions - list of actions what you need separated by comma, mentionedAccounts - list of accounts what you need separated by comma, tsStart - timestamp (in ms) from you need transactions, tsEnd - timestamp (in ms) by you need transactions.
        Limit is equals 100
        For example: [{"_id":"5b7a7f91ecf5d80972c772ab","msgObject":{"c1":"12036040","c2":"issue","c3":"boidcomtoken@boidcomtoken","c4":"gyytcmjwhege","c5":"15870.0875 BOID","c6":"Earn more BOIDs at boid.com."},"mentionedAccounts":["boidcomtoken","gyytcmjwhege"],"txid":"8c691e4d166031580342ab265ef344942d3861e1b7ed7cdda59495fd945a27a5","block":12036040,"account":"boidcomtoken","to":"gyytcmjwhege","action":"issue","date":"2018-08-20T02:25:03.000Z","description":"Token issue Funds","createdAt":"2018-08-20T08:45:05.212Z","__v":0}]
        - API_PREFIX/transactions/:txid/ returns transactions by transaction id
        For example {"msgObject":{"c1":"12036050","c2":"issue","c3":"boidcomtoken@boidcomtoken","c4":"gyytcmjxgige","c5":"9019.8000 BOID","c6":"Earn more BOIDs at boid.com."},"mentionedAccounts":["boidcomtoken","gyytcmjxgige"],"_id":"5b7a7f92ecf5d80972c77599","txid":"2ce26019bc87d0b6ad86a989720bb981103264d6514afef820360c5c7883f821","block":12036050,"account":"boidcomtoken","to":"gyytcmjxgige","action":"issue","date":"2018-08-20T02:25:08.000Z","description":"Token issue Funds","createdAt":"2018-08-20T08:45:06.535Z","__v":0}
        - API_PREFIX/p2p/:type/ if type === endpoints returns p2p endpoints, if type === server returns p2p server addres
        For example [{"p2p":["fullnode.eoslaomao.com:443"],"name":"eoslaomaocom"},{"p2p":["node1.eosnewyork.io:6987"],"name":"eosnewyorkio"},{"p2p":["seed1.eos42.io:9876","seed2.eos42.io:9876"],"name":"eos42freedom"}]

- socket
    - usersonline - returns the number of users, which using app now
    - table - returns rows that were updated from the last event to now
    - totalstaked - returns total stacked value
    - reload_producers - an event that called when producers positions were changed
    - transactions - returns last part of transactions what were generated from the last event to now
    - info - returns general info
    - blockupdate - returns main info about current block



***

## Running the Project

### server
- check config folder => default.json / create another config file for special env
- configure main configs for you:
    - SERVER (set HOST and PORT)
    - NODE (HOST and PORT) strongly recommend select node with a minimum ping for you
    - MONGODB (settings of your mongodb)
    - BUGSNAG_API_KEY (create and config your bugsnag app before)
    - WHITE_LIST (list with domains, that will be able to appeal to your API
- look through other configs
- install pm2 module if you prefer running with pm2 (npm i -g pm2)
- start the backend app:
    - with pm2 (pm2 start ecosystem.config.js)
    - with docker (docker build -t "appName" . => docker run "appName")
    - from console (npm start)

***

## Code

### Folder structure

```
├─ config                         # config json files
├─ src                              # source files.
│  ├─ db                           # data base files.
│  │  ├─ schema               # mongoose schemas.
│  ├─ endpoints                # API endpoints.
│  │  ├─ api.v1                   # API endpoints, version 1
│  │  ├─ commands            # commands endpoints
│  ├─ handlers                   # handlers for hendling realtime data
│  ├─ helpers                     # App helpers.
│  ├─ migrations                 # db migrations scripts
│  ├─ routines                     # routine work
│  │  ├─ cleanTran...           # clean TransactionsLastHourCollection every 15 minutes from old data (created more than one hour again)
│  │  ├─ handleBlock           # handle blocks (insert transactions, update/insert accounts, update producers)
│  │  ├─ updateProducers   # update producers data (bp json).
│  ├─ socket                        # socket events.
│  ├─ utils                            # utils
```
