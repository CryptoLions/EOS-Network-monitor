const { GAP_BETWEEN_PRODUCING_LOOP } = require('../../constants');

const check = top21 => {
  const now = Date.now();
  return top21.map(p => ({
    name: p.name,
    missedProducing: now - p.producedTimestamp < GAP_BETWEEN_PRODUCING_LOOP,
  }));
};

module.exports = check;
