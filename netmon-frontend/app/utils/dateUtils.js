import moment from 'moment';

export const convertUtcToLocal = date => {
  if (!date || date === '1970-01-01T00:00:00.000') {
    return '';
  }
  return moment(moment.utc(date).toDate()).format('YYYY-MM-DD HH:mm:ss');
};
