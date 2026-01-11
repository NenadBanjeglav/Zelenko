export const getSerbianDayLabel = (days: number) => {
  const absDays = Math.abs(days);
  const lastTwoDigits = absDays % 100;
  const lastDigit = absDays % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "dana";
  }

  if (lastDigit === 1) {
    return "dan";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "dana";
  }

  return "dana";
};
