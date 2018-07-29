const nodeOne = {
  bp_name: 'acryptolions',
  organisation: 'CryptoLions.io',
  url: 'http://cryptolions.io',
  location: 'Germany',
  http_server_address: '0.0.0.0:58888',
  p2p_listen_endpoint: '0.0.0.0:59876',
  https_server_address: '',
  p2p_server_address: '127.0.0.1:59876',
  pub_key: 'EOS5UDp9v8rQfrZwUPog8KetBo7cEEbMRrSpBJjfPqB3489Mz2b47',
  bp: true,
  enabled: true,
  comment: '',
  telegram: '',
};

const nodeTwo = {
  bp_name: 'eoscanadacom',
  organisation: 'EOS Canada',
  url: 'https://www.eoscanada.com',
  location: 'CA, Montreal, Quebec',
  http_server_address: 'mainnet.eoscanada.com:80',
  p2p_listen_endpoint: 'peering.mainnet.eoscanada.com:9876',
  https_server_address: 'mainnet.eoscanada.com:443',
  p2p_server_address: 'peering.mainnet.eoscanada.com:9876',
  pub_key: 'EOS5UDp9v8rQfrZwUPog8KetBo7cEEbMRrSpBJjfPqB3489Mz2b47',
  bp: true,
  enabled: true,
  comment: '',
  telegram: '',
};

module.exports = [nodeOne, nodeTwo];
