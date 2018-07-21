#!/bin/bash
################################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
###############################################################################

DATADIR="./logs"

./stop.sh
node monitor/index.js  > $DATADIR/bem-server_out.log 2> $DATADIR/bem-server_err.log &  echo $! > $DATADIR/bem-server.pid
