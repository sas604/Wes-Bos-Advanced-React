export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimalFractionDigits: 2,
  };

  // check if its a clean amount
  if (amount % 100 === 0) {
    options.minimalFractionDigits = 0;
  }

  const formater = Intl.NumberFormat('en-US', options);

  return formater.format(amount / 100);
}
