const { fork } = require('child_process');
const Path = require('path');

const createWorker = () => {
  const path = Path.resolve(__dirname, 'storageWorker.js');
  const worker = fork(path);
  return {
    onAllData: (listener) => worker.on('message', ({ message, data }) => {
      if (message === 'allData') {
        listener(data);
      }
    }),
    onUpdated: (listener) => worker.on('message', ({ message, data }) => {
      if (message === 'updated') {
        listener(data);
      }
    }),
    send: (message, data) => worker.send({ message, data }),
  };
};

const createStorage = () => {
  const worker = createWorker();
  let dispatchAllDataReceived = null;
  let dispatchUpdatedDataReceived = null;
  worker.onAllData(table => {
    if (dispatchAllDataReceived) {
      dispatchAllDataReceived(table);
    }
  });
  worker.onUpdated(updated => {
    if (dispatchUpdatedDataReceived) {
      dispatchUpdatedDataReceived(updated);
    }
  });
  return {
    updateNodeInfo(info) {
      worker.send('updateNodeInfo', info);
    },
    updateMissedProducing(top21) {
      worker.send('updateMissedProducing', top21);
    },
    updateProducers(producers) {
      worker.send('updateProducers', producers);
    },
    updateGeneralInfo(info) {
      worker.send('updateGeneralInfo', info);
    },
    async getAll() {
      worker.send('getAll');
      return new Promise(resolve => {
        dispatchAllDataReceived = resolve;
      });
    },
    async getUpdated() {
      worker.send('getUpdated');
      return new Promise(resolve => {
        dispatchUpdatedDataReceived = resolve;
      });
    },
    async replaceAll(table) {
      worker.send('replaceAll', table);
    },
  };
};

module.exports = createStorage;
