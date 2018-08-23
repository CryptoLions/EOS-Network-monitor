import EosApi from 'eosjs-api';

export const URL = 'http://eosnetworkmonitor.io:3000';
// export const URL = 'http://51.15.208.65:3010';
// export const URL = 'http://localhost:3002';

export const CHAIN_ID = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

export const THROTTLE_TIMEOUT = 600;

export const API_KEY = 'AIzaSyBJrgbdsOfzPMKQFcsnXJHtbwxlVglXkVw';

// how many transaction do we keep in the reducer
export const TRANSACTIONS_LIMIT = 50;

export const HISTORY_ITEMS_PER_PAGE = 10;

// Eos API
export const EOS = EosApi({
  httpEndpoint: 'http://bp.cryptolions.io:8888',
});
