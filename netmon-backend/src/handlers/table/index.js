const { fork } = require('child_process');
const Path = require('path');

const { logInfo } = require('../../helpers');

const initProducerHandler = async () => {
  const tableOnUpdateListeners = [];
  const orderOnChangeListeners = [];
  let table = [];
  let currentWorker;

  const createWorker = () => {
    logInfo('table worker has been created');
    const path = Path.resolve(__dirname, 'worker.js');
    const worker = fork(path);
    worker.on('message', ({ message, data }) => {
      if (message === 'all') {
        table = data;
      } else if (message === 'updated') {
        tableOnUpdateListeners.forEach(onDataUpdate => onDataUpdate(data));
      } else if (message === 'order') {
        orderOnChangeListeners.forEach(onOrderChange => onOrderChange(data));
      }
    });
    worker.on('close', () => createWorker());
    currentWorker = worker;
  };

  const onUpdate = listener => {
    tableOnUpdateListeners.push(listener);
  };
  const onOrderChange = listener => {
    orderOnChangeListeners.push(listener);
  };
  const setCurrentInfo = data => {
    currentWorker.send({ message: 'setCurrentInfo', data });
  };
  const getAll = () => table;

  createWorker();

  return {
    onUpdate,
    onOrderChange,
    setCurrentInfo,
    getAll,
  };
};

module.exports = initProducerHandler;
