export const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
