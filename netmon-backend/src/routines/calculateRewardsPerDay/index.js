/* eslint-disable no-nested-ternary */
const moment = require('moment');
const { APPROXIMATELY_BLOCKS_PRODUCED_PER_DAY } = require('config');

const { ProducerModelV2, StateModelV2 } = require('../../db');
const { castToInt, createEosApi, pickAs, logInfo, logError } = require('../../helpers');
const {
  BLOCK_REWARDS_PART,
  VOTE_REWARDS_PART,
  EXPECTED_PRODUCED_BLOCK_FOR_DAY_NUMBER,
  ACTIVE_PRODUCERS_NUMBER,
  EXPECTED_CALCULATING_TIMES_FOR_DAY,
} = require('../../constants');

const api = createEosApi();

const setRewardsToZero = async () => {
  await ProducerModelV2.updateMany({}, { $set: { rewards_per_day: 0, produced_per_day: 0 } }).exec();
  await StateModelV2.update({ id: 1 }, { $set: { lastRewardsSetToZeroAt: new Date(), produced_per_day: 0 } }).exec();
};

const getInflation = async () => {
  const systemData = await api.getCurrencyStats({ symbol: 'EOS', code: 'eosio.token' });
  const totalSupply = castToInt(systemData.EOS.supply.split(' ')[0]);
  return totalSupply / 100 / 365;
};

const getMinimumPercentage = (inflation) => 100 / (inflation * VOTE_REWARDS_PART);

const getAccountPercentage = ({ onePercentVoteWeight, total_votes }) => total_votes / onePercentVoteWeight / 100;

const calculateRewardsForOne = ({
  onePercentVoteWeight,
  total_votes,
  inflation,
  undistributedInterest,
  distributedInterest,
  unpaid_blocks,
  producedTimesForDay,
  producedWholeDayNumber,
  top,
}) => {
  const accountPercent = total_votes / onePercentVoteWeight / 100;
  const clearRewards = inflation * VOTE_REWARDS_PART * accountPercent;
  const accountPercentForUndistributed = total_votes / onePercentVoteWeight / (distributedInterest * 100);
  const undistributedRewards = inflation * VOTE_REWARDS_PART * undistributedInterest * accountPercentForUndistributed;
  const voteRewardsForDay = clearRewards + undistributedRewards > 100
    ? clearRewards + undistributedRewards
    : 0;
  const producerPartOfBlockRewards = producedWholeDayNumber === producedTimesForDay
    ? 1 / ACTIVE_PRODUCERS_NUMBER
    : top
      ? (EXPECTED_CALCULATING_TIMES_FOR_DAY - (producedWholeDayNumber - producedTimesForDay))
        / EXPECTED_CALCULATING_TIMES_FOR_DAY / ACTIVE_PRODUCERS_NUMBER
      : producedTimesForDay / EXPECTED_CALCULATING_TIMES_FOR_DAY / ACTIVE_PRODUCERS_NUMBER;
  const expectedBlockRewardsForDay = inflation * BLOCK_REWARDS_PART * producerPartOfBlockRewards;
  const expectedBlockRewardsOnThisPosition = top ? (inflation * BLOCK_REWARDS_PART) / ACTIVE_PRODUCERS_NUMBER : 0;
  const rewards_per_day = expectedBlockRewardsForDay + voteRewardsForDay;
  const expectedRewardsOnThisPosition = voteRewardsForDay + expectedBlockRewardsOnThisPosition;
  const totalBlockUnpaidRewards = unpaid_blocks
    ? (inflation / EXPECTED_PRODUCED_BLOCK_FOR_DAY_NUMBER) * unpaid_blocks
    : 0;
  return {
    voteRewardsForDay,
    expectedBlockRewardsForDay,
    rewards_per_day,
    totalBlockUnpaidRewards,
    expectedRewardsOnThisPosition,
  };
};

const calculateRewards = async () => {
  const { total_producer_vote_weight } = await api.getProducers({ json: true, limit: 1 });
  const onePercentVoteWeight = castToInt(total_producer_vote_weight) / 100;
  const totalProducedPerDay = APPROXIMATELY_BLOCKS_PRODUCED_PER_DAY;
  const inflation = await getInflation();
  const minimumPercentForThreshold = getMinimumPercentage(inflation);

  const producersFromDB = await ProducerModelV2
    .find({})
    .sort({ total_votes: -1 })
    .select('produced_per_day name unpaid_blocks total_votes expectedIncomeData');

  const producers = producersFromDB
    .map((producer, i) => ({
      ...pickAs(producer, ['name', 'produced_per_day', 'unpaid_blocks', 'total_votes']),
      top: i < 21,
      producedTimesForDay: producer.expectedIncomeData.producedTimesForDay,
    }));

  const producedWholeDayNumber = producers
    .map(e => e.producedTimesForDay)
    .reduce((max, current) => (current > max ? current : max), 0);

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
  // at first we rudely calculated undistributedInterest and distributedInterest,
  // but some producers have bit less than minimumPercentForThreshold
  // and if we move them to that part of the producers that get the award, they will overcome the threshold of 100 coins

  const bulkWriteOptions = producers.map(p => {
    const {
      voteRewardsForDay,
      expectedBlockRewardsForDay,
      rewards_per_day,
      totalBlockUnpaidRewards,
      expectedRewardsOnThisPosition,
    } = calculateRewardsForOne({
      ...p,
      inflation,
      totalProducedPerDay,
      onePercentVoteWeight,
      total_producer_vote_weight,
      undistributedInterest,
      distributedInterest,
      producedWholeDayNumber,
    });
    return {
      updateOne: {
        filter: { name: p.name },
        update: {
          $set: {
            rewards_per_day,
            'expectedIncomeData.voteRewardsForDay': voteRewardsForDay,
            'expectedIncomeData.expectedBlockRewardsForDay': expectedBlockRewardsForDay,
            'expectedIncomeData.totalBlockUnpaidRewards': totalBlockUnpaidRewards,
            'expectedIncomeData.expectedRewardsOnThisPosition': expectedRewardsOnThisPosition,
          },
          $inc: {
            'expectedIncomeData.producedTimesForDay': p.top ? 1 : 0,
          },
        },
      },
    };
  });
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
    logInfo('The rewards per today was successfully calculated', new Date());
  } catch (e) {
    logError('Calculating the rewards per day failed');
    logError(e);
  }
};
