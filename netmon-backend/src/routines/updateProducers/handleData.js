const { omit } = require('lodash');

const getBPjson = require('./getBPjson');
const {
  castToInt,
  correctBpUrl,
  correctApiUrl,
  correctP2PUrl,
  correctSslUrl,
  createLogger,
} = require('../../helpers');
const { ProducerModelV2 } = require('../../db');

const { info: logInfo } = createLogger();

const updateProducer = async producer => {
  // update nodes
  const oldProducerFromDb = await ProducerModelV2.findOne({ name: producer.name }).select('nodes');
  if (oldProducerFromDb && oldProducerFromDb.nodes) {
    const producerCopy = {
      ...producer,
      isActive: true,
      nodes:
      (producer.nodes && producer.nodes.map((node, index) => ({
        ...node,
        downtimes: (oldProducerFromDb.nodes[index] && oldProducerFromDb.nodes[index].downtimes) || [],
      })))
      || oldProducerFromDb.nodes,
    };
    await ProducerModelV2.updateOne({ name: producer.name }, { $set: producerCopy }, { upsert: true }).exec();
  } else {
    await ProducerModelV2.updateOne(
      { name: producer.name },
      { $set: { ...producer, isActive: true } }, { upsert: true },
    ).exec();
  }
};

let PRODUCERS_WITHOUT_URL = [];
let PRODUCERS_WITHOUT_BP_JSON = [];

const handleData = async producers => {
  PRODUCERS_WITHOUT_URL = [];
  PRODUCERS_WITHOUT_BP_JSON = [];
  const promises = Promise.all(
    producers
      .map(producer => ({
        ...omit(producer, ['owner', 'producer_key']),
        bp_name: producer.owner,
        bp_key: producer.producer_key,
      }))
      .map(async producer => {
        const { bp_name, bp_key, total_votes, unpaid_blocks, last_claim_time, location } = producer;
        const url = correctBpUrl(producer.url);
        if (!url.startsWith('http')) {
          PRODUCERS_WITHOUT_URL.push(bp_name);
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

        const bpData = await getBPjson(url);
        if (!bpData || !bpData.org) {
          PRODUCERS_WITHOUT_BP_JSON.push(bp_name);
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
            };
          })
          .filter(e => e);

        return updateProducer({
          name: bp_name,
          nodes,
          logo: bpData.org.branding && bpData.org.branding.logo_256,
          'contacts.email': bpData.org.email,
          candidateName: bpData.org.candidate_name,
          url,
          producer_key: bp_key,
          total_votes,
          unpaid_blocks,
          last_claim_time: castToInt(last_claim_time),
          location: `${bpData.org.location.country},${bpData.org.location.name}`,
        });
      }),
  );
  const result = await promises;

  await ProducerModelV2.updateMany({ name: { $nin: producers.map(p => p.owner) } }, { isActive: false }).exec();

  logInfo(`PRODUCERS UPDATE:
  TOTAL NUMBER: ${producers.length}
  --------------------------------------------------------
  SUCCESS: ${producers.length - PRODUCERS_WITHOUT_URL.length - PRODUCERS_WITHOUT_BP_JSON.length}
  --------------------------------------------------------
  list of producers without URL: ${PRODUCERS_WITHOUT_URL.length}
  ${PRODUCERS_WITHOUT_URL}
  --------------------------------------------------------
  list of producers without bp.json (can not fetch any data from the provided url): ${PRODUCERS_WITHOUT_BP_JSON.length}
  ${PRODUCERS_WITHOUT_BP_JSON}
`);

  return result;
};

module.exports = handleData;
