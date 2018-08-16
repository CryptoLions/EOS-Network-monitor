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
