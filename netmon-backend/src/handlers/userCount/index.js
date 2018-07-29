const { LISTENERS: { ON_USERS_COUNT_CHANGE_INTERVAL } } = require('config');

const initUserHandler = () => {
  const listeners = [];
  let usersCount = 0;
  let previousValue = 0;

  const notify = () => {
    listeners.forEach(listener => {
      listener(usersCount);
    });
  };

  const notifyIfNeeded = () => {
    if (usersCount !== previousValue) {
      previousValue = usersCount;
      notify();
    }
  };

  if (ON_USERS_COUNT_CHANGE_INTERVAL !== 0) {
    setInterval(notifyIfNeeded, ON_USERS_COUNT_CHANGE_INTERVAL);
  }

  return {
    onUpdate(listener) {
      listeners.push(listener);
    },
    addUser() {
      usersCount += 1;
      if (ON_USERS_COUNT_CHANGE_INTERVAL === 0) {
        notify();
      }
    },
    minusUser() {
      usersCount -= 1;
      if (ON_USERS_COUNT_CHANGE_INTERVAL === 0) {
        notify();
      }
    },
  };
};

module.exports = initUserHandler;
