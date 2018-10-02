const { fork } = require('child_process');
const Path = require('path');
const { eosApi, logError } = require('../../helpers');

const listeners = [];

let lastAdditionalInfo;

const createWorker = () => {
  const path = Path.resolve(__dirname, 'worker.js');
  const worker = fork(path);
  worker.on('message', (data) => {
    if (data.additionalInfo) {
      lastAdditionalInfo = { ...data.additionalInfo };
    }
    listeners.forEach(onData =>
      onData(data.additionalInfo ? data : { ...data, info: { ...lastAdditionalInfo, ...data.info } }));
  });
  worker.on('close', () => {
    createWorker();
    logError('Info worker was recreated');
  });
};

const initInfoHandler = async () => {
  createWorker();
  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
    getBlockInfo(blockNum) {
      return eosApi.getBlock(blockNum);
    },
  };
};

module.exports = initInfoHandler;
