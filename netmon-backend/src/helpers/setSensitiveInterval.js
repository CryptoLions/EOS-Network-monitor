const start = (fn, timeout, interval, ...params) => {
  setTimeout(async () => {
    const startedAt = Date.now();
    await fn(params);
    const endedAt = Date.now();
    if (endedAt - startedAt >= interval) {
      start(fn, 0, interval, ...params);
    } else {
      const newTimeout = interval - (endedAt - startedAt);
      start(fn, newTimeout, interval, ...params);
    }
  }, timeout);
};

/**
 * waits for the function to be executed,
 * and only then it runs the function again
 * (if the launch time is appropriate),
 * regardless of whether the launch time is appropriate or not
 * @param fn
 * @param milliseconds
 * @param params
 */
const setSensitiveInterval = (fn, milliseconds, ...params) => {
  start(fn, milliseconds, milliseconds, ...params);
};

module.exports = setSensitiveInterval;
