#!/bin/bash
################################################################################
#
# Scrip Created by http://CryptoLions.io
# https://github.com/CryptoLions/scripts/
#
###############################################################################

#echo "temporary closed"
exit

FAUCETUSER_EOS="eosio"
FAUCETUSER_JUNGLE="lioninjungle"

./scripts/cleos.sh transfer $FAUCETUSER_EOS $1 "10000.0000 EOS" 'Jungle Faucet' -p $FAUCETUSER 
./scripts/cleos.sh transfer $FAUCETUSER_JUNGLE $1 "10000.0000 JUNGLE" 'Jungle Faucet' -p $FAUCETUSER 
#sleep 1
#./cleos.sh push action eosio.token transfer '["'$FAUCETUSER'", "'$1'", "100.0000 JUNGLE", "Jungle Faucet"]' -p $FAUCETUSER
#sleep 1
#./cleos.sh push action eosio.token transfer '["'$FAUCETUSER'", "'$1'", "100.0000 EOS", "Jungle Faucet"]' -p $FAUCETUSER

