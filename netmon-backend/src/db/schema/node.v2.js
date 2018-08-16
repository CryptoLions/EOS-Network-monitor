const { Schema } = require('mongoose');

const Node = new Schema({
  bp_name: { type: String, index: true },
  bp: { type: Boolean },
  enabled: { type: Boolean, default: true },
  http_server_address: { type: String },
  https_server_address: { type: String },
  location: { type: String },
  organisation: { type: String, index: true },
  p2p_listen_endpoint: { type: String },
  p2p_server_address: { type: String },
  pub_key: { type: String },
  downtimes: [{
    from: { type: Date, default: null },
    to: { type: Date, default: null },
  }],
  url: { type: String },
});

module.exports = Node;
