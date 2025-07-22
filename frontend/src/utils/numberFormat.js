// utils/numberFormat.js
export const formatNumber = (val, opts = {}) =>
  new Intl.NumberFormat("en-US", {
    // tweak these if you need Persian digits or fixed decimals
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  }).format(Number(val));
