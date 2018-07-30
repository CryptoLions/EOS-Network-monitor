/* eslint-disable camelcase,no-plusplus,max-len */
/* ###############################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
###############################################################################  */

const handleData = require('./handleData');
const getData = require('./getData');


module.exports = async () => {
  try {
    const data = await getData();
    await handleData(data);
    console.log('bp.json updated');
  } catch (e) {
    console.log(e);
  }
};
