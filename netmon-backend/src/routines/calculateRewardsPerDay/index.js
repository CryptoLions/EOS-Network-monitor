const moment = require('moment');
const { APPROXIMATELY_BLOCKS_PRODUCED_PER_DAY } = require('config');

const { ProducerModelV2, StateModelV2 } = require('../../db');
const { castToInt, createEosApi } = require('../../helpers');

const api = createEosApi();

const BLOCK_REWARDS_PART = 0.25;
const VOTE_REWARDS_PART = 0.75;

const setRewardsToZero = async () => {
  await ProducerModelV2.updateMany({}, { $set: { rewards_per_day: 0, produced_per_day: 0 } }).exec();
  await StateModelV2.update({ id: 1 }, { $set: { lastRewardsSetToZeroAt: new Date(), produced_per_day: 0 } }).exec();
};

const getInflation = async () => {
  const systemData = await api.getCurrencyStats({ symbol: 'EOS', code: 'eosio.token' });
  const totalSupply = castToInt(systemData.EOS.supply.split(' ')[0]);
  return totalSupply / 100 / 365.25;
};

const getMinimumPercentage = (inflation) => 100 / (inflation * VOTE_REWARDS_PART);

const getAccountPercentage = ({ onePercentVoteWeight, total_votes }) => total_votes / onePercentVoteWeight / 100;

const calculateRewardsForOne = ({
  onePercentVoteWeight,
  total_votes,
  inflation,
  undistributedInterest,
  distributedInterest,
}) => {
  const accountPercent = total_votes / onePercentVoteWeight / 100;
  if (accountPercent > getMinimumPercentage(inflation)) {
    const clearRewards = inflation * VOTE_REWARDS_PART * accountPercent;
    const accountPercentForUndistributed = total_votes / onePercentVoteWeight / (distributedInterest * 100);
    const undistributedRewards = inflation * VOTE_REWARDS_PART * undistributedInterest * accountPercentForUndistributed;
    return clearRewards + undistributedRewards;
  }
  return 0;
};

const calculateRewardsForOneProducer =
  ({
    total_votes,
    totalProducedPerDay,
    onePercentVoteWeight,
    inflation,
    total_producer_vote_weight,
    undistributedInterest,
    distributedInterest,
  }) =>
    (inflation * (BLOCK_REWARDS_PART / 21)) +
    calculateRewardsForOne({
      onePercentVoteWeight,
      total_votes,
      totalProducedPerDay,
      inflation,
      total_producer_vote_weight,
      undistributedInterest,
      distributedInterest,
    });


const calculateRewards = async () => {
  const { total_producer_vote_weight } = await api.getProducers({ json: true, limit: 1 });
  const onePercentVoteWeight = castToInt(total_producer_vote_weight) / 100;
  const totalProducedPerDay = APPROXIMATELY_BLOCKS_PRODUCED_PER_DAY;
  const inflation = await getInflation();
  const minimumPercentForThreshold = getMinimumPercentage(inflation);

  const producers = await ProducerModelV2
    .find({})
    .sort({ total_votes: 1 })
    .select('produced_per_day name total_votes');

  // sum of all undistributed percents that belongs to producers who  not cross the threshold in 100 EOS
  const undistributedInterest = producers.reduce((res, val) => {
    const accountPercentage = getAccountPercentage({ onePercentVoteWeight, total_votes: val.total_votes });
    return accountPercentage < minimumPercentForThreshold
      ? res + accountPercentage
      : res;
  }, 0);
  const distributedInterest = producers.reduce((res, val) => {
    const accountPercentage = getAccountPercentage({ onePercentVoteWeight, total_votes: val.total_votes });
    return accountPercentage > minimumPercentForThreshold
      ? res + accountPercentage
      : res;
  }, 0);

  const bulkWriteOptions = producers.map(p => ({
    updateOne: {
      filter: { name: p.name },
      update: {
        $set: {
          rewards_per_day: p.produced_per_day
            ? calculateRewardsForOneProducer({
              produced_per_day: p.produced_per_day,
              total_votes: p.total_votes,
              inflation,
              totalProducedPerDay,
              onePercentVoteWeight,
              total_producer_vote_weight,
              undistributedInterest,
              distributedInterest,
            })
            : calculateRewardsForOne({
              produced_per_day: p.produced_per_day,
              total_votes: p.total_votes,
              inflation,
              totalProducedPerDay,
              onePercentVoteWeight,
              total_producer_vote_weight,
              undistributedInterest,
              distributedInterest,
            }),
        },
      },
    },
  }));
  return ProducerModelV2.bulkWrite(bulkWriteOptions);
};

module.exports = async () => {
  try {
    const { lastRewardsSetToZeroAt } = await StateModelV2.findOne({ id: 1 }).select('lastRewardsSetToZeroAt');
    if (moment(lastRewardsSetToZeroAt).isBefore(moment(), 'days')) {
      await setRewardsToZero();
      return;
    }
    await calculateRewards();
    console.log('The rewards per today was successfully calculated');
  } catch (e) {
    console.log('Calculating the rewards per day failed');
    console.error(e);
  }
};
