const SECOND = 1000;

const CONNECTION_REFUSED_BY_SERVER = 'ECONNREFUSED';
const SERVER_NOT_FOUND = 'ENOTFOUND';
const CHECK_URLS = ['https_server_address', 'http_server_address'];

const BLOCK_REWARDS_PART = 0.25;
const VOTE_REWARDS_PART = 0.75;

const ONE_HOUR = SECOND * 60 * 60;

const BULK_WRITE_LIMIT = 100000;

const BLOCKS_NUMBER_IN_PRODUCING_LOOP = 12;

const GAP_BETWEEN_PRODUCING_LOOP = (6 * 21) + 20; // https://trello.com/c/y8ZD1Kyy/69-catch-missed-producing-and-mark-by-color-if-node-is-in-top-21-is-in-approved-schedule-cleos-get-schedule-and-do-not-produced-mor

module.exports = {
  BLOCKS_NUMBER_IN_PRODUCING_LOOP,
  BLOCK_REWARDS_PART,
  BULK_WRITE_LIMIT,
  CHECK_URLS,
  CONNECTION_REFUSED_BY_SERVER,
  GAP_BETWEEN_PRODUCING_LOOP,
  ONE_HOUR,
  SECOND,
  SERVER_NOT_FOUND,
  VOTE_REWARDS_PART,
};
