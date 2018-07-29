const { exec } = require('child_process');

/**
 * Wrapper function for child_process.exec, return promise
 * @param command for child_process.exec
 * @param options for child_process.exec
 * @returns {Promise<any>} on success { stdout, stderr }
 */
const execWrapper = async (command, options) => new Promise((resolve, reject) => {
  const cb = async (err, stdout, stderr) => {
    if (err) {
      return reject(err);
    }
    return { stdout, stderr };
  };
  if (options) {
    exec(command, options, cb);
  } else {
    exec(command, cb);
  }
});

module.exports = {
  exec: execWrapper,
};
