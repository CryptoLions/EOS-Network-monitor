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

DIR="./"


    if [ -f $DIR"/bem-server.pid" ]; then
	pid=`cat $DIR"/bem-server.pid"`
	echo $pid
	kill $pid
	rm -r $DIR"/bem-server.pid"
	
	echo -ne "Stoping Daemon"

        while true; do
            [ ! -d "/proc/$pid/fd" ] && break
            echo -ne "."
            sleep 1
        done
        echo -ne "\rDaemon Stopped.    \n"
    fi

