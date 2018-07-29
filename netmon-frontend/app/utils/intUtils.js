export const formatNumber = x => {
  if (!x) {
    return 0;
  }
  const parts = parseFloat(x.toFixed(2))
    .toString()
    .split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
};
