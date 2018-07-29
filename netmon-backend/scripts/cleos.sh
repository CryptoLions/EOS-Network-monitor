#!/bin/bash
################################################################################
#
# Scrip Created by http://CryptoLions.io
# https://github.com/CryptoLions/scripts/
#
###############################################################################

NODEOSBINDIR="/home/MainNET/v1.0.6/build/programs"

WALLETHOST="127.0.0.1"
#NODEHOST="127.0.0.1"
#NODEPORT="58888"
NODEHOST="193.93.219.219"
NODEPORT="8888"

WALLETPORT="55553"


#$NODEOSBINDIR/cleos/cleos -u http://$NODEHOST:$NODEPORT --wallet-url http://$WALLETHOST:$WALLETPORT wallet unlock --password XXXXXXXX > /dev/null 2>/dev/null

$NODEOSBINDIR/cleos/cleos -u http://$NODEHOST:$NODEPORT --wallet-url http://$WALLETHOST:$WALLETPORT "$@"
