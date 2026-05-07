export const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));
