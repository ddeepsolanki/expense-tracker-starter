const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export const formatCurrency = (value) => currency.format(value);

// Parse "YYYY-MM-DD" as a local date so it doesn't shift a day in negative UTC offsets.
export const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return shortDate.format(new Date(year, month - 1, day));
};

export const formatCategory = (category) =>
  category.charAt(0).toUpperCase() + category.slice(1);
