const getBPjson = require('./getBPjson');
const {
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
  castToInt,
} = require('../../helpers');
const { ProducerModelV2 } = require('../../db');

const updateProducer = producer => ProducerModelV2.updateOne(
  { name: producer.name },
  { $set: producer },
  { upsert: true },
).exec();


const handleData = async (data) => {
  const bpPromises = data
    .map(e => {
      const {
        url,
        owner,
        producer_key,
        total_votes,
        unpaid_blocks,
        last_claim_time,
        location,
      } = e;
      return {
        url,
        bp_name: owner,
        bp_key: producer_key,
        total_votes,
        unpaid_blocks,
        last_claim_time,
        location,
      };
    })
    .map(async bp => {
      const {
        bp_name,
        bp_key,
        total_votes,
        unpaid_blocks,
        last_claim_time,
        location,
      } = bp;
      const url = correctBpUrl(bp.url);

      if (url.indexOf('http') < 0) {
        return updateProducer({
          name: bp_name,
          url,
          producer_key: bp_key,
          total_votes,
          unpaid_blocks,
          last_claim_time: castToInt(last_claim_time),
          location,
        });
      }
      const bpData = await getBPjson({}, bp_name, url);
      if (!bpData || !bpData.org) {
        return updateProducer({
          name: bp_name,
          url,
          producer_key: bp_key,
          total_votes,
          unpaid_blocks,
          last_claim_time: castToInt(last_claim_time),
          location,
        });
      }
      const nodes = bpData.nodes
        .map(node => {
          if (!node.api_endpoint && !node.ssl_endpoint && !node.p2p_endpoint) {
            return undefined;
          }

          const apiEndpoint = correctApiUrl(node.api_endpoint);
          const sslEndpoint = correctSslUrl(node.ssl_endpoint);
          const p2pEndpoint = correctP2PUrl(node.p2p_endpoint);

          return {
            bp_name,
            organisation: bpData.org.candidate_name,
            location: `${bpData.org.location.country},${bpData.org.location.name}`,
            http_server_address: apiEndpoint,
            p2p_listen_endpoint: p2pEndpoint,
            https_server_address: sslEndpoint,
            p2p_server_address: p2pEndpoint,
            pub_key: bp_key,
            bp: true,
            enabled: false,
          };
        })
        .filter(e => e);
      return updateProducer({
        name: bp_name,
        nodes,
        url,
        producer_key: bp_key,
        total_votes,
        unpaid_blocks,
        last_claim_time: castToInt(last_claim_time),
        location: `${bpData.org.location.country},${bpData.org.location.name}`,
      });
    });
  return Promise.all(bpPromises);
};

module.exports = handleData;
