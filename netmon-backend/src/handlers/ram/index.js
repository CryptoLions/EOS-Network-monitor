/* eslint-disable no-param-reassign */
const { fork } = require('child_process');
const Path = require('path');
const { DAY, KILOBYTE } = require('../../constants');
const { logError, castToInt } = require('../../helpers');
const { RamModelV2 } = require('../../db');

const listeners = [];

const createWorker = () => {
  const path = Path.resolve(__dirname, 'worker.js');
  const worker = fork(path);
  worker.on('message', ram => listeners.forEach(onData => onData(ram)));
  worker.on('close', () => {
    createWorker();
    logError('Ram worker has been recreated');
  });
};

const compileGroupOptions = (interval) => ({
  $group: {
    _id: {
      year: { $year: { $dateFromString: { dateString: '$date' } } },
      dayOfYear: { $dayOfYear: { $dateFromString: { dateString: '$date' } } },
      hour: { $hour: { $dateFromString: { dateString: '$date' } } },
      interval: {
        $subtract: [
          { $minute: { $dateFromString: { dateString: '$date' } } },
          { $mod: [{ $minute: { $dateFromString: { dateString: '$date' } } }, interval] },
        ],
      },
    },
    base: { $avg: '$base' },
    quote: { $avg: '$quote' },
    date: { $first: '$date' },
  },
});

const initInfoHandler = async () => {
  createWorker();
  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
    async getRamHistory({ from, to = Date.now(), frequencyInMinutes = 5 }) {
      if (!from) {
        from = to - DAY;
      }
      const ram = await RamModelV2
        .aggregate([
          { $match: { date: { $gt: new Date(from), $lte: new Date(to) } } },
          { $project: {
            quote: 1,
            base: 1,
            date: { $dateToString: {
              format: '%Y-%m-%d %H:%M:59',
              date: '$date',
            } } } },
          { ...compileGroupOptions(castToInt(frequencyInMinutes)) },
          { $project: {
            _id: 0,
            date: '$date',
            quote: 1,
            base: 1,
            price: {
              $multiply: [{ $divide: ['$quote', '$base'] }, KILOBYTE],
            },
          },
          },
          { $sort: { date: -1 } },
        ]);
      return ram;
    },
  };
};

module.exports = initInfoHandler;
