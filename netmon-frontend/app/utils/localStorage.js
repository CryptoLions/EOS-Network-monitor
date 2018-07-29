const localStore = () => {
  const ls = window.localStorage;

  const set = (key, value) => {
    try {
      ls.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  };

  const get = key => JSON.parse(ls.getItem(key));

  const remove = key => ls.removeItem(key);

  return {
    set,
    get,
    remove,
  };
};

const ls = localStore();

export { ls };
