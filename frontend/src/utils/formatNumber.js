export const formatNumber = (number) => {
  if (
    number === null ||
    number === undefined
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-US"
  ).format(number);
};


export const abbreviateNumber = (number) => {
  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return number;
};