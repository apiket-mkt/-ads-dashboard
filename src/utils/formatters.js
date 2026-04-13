export const formatKRW = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return '₩' + Math.round(value).toLocaleString('ko-KR');
};

export const parseKRW = (str) => {
  if (!str) return 0;
  const cleaned = String(str).replace(/[₩,\s]/g, '');
  return parseInt(cleaned, 10) || 0;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return Math.round(value).toLocaleString('ko-KR');
};

export const formatChangeRate = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

export const formatDiff = (current, previous, type = 'krw') => {
  if (previous === null || previous === undefined) return null;
  const diff = current - previous;
  const sign = diff >= 0 ? '+' : '-';
  const abs = Math.abs(diff);
  if (type === 'krw') return `${sign}₩${Math.round(abs).toLocaleString('ko-KR')}`;
  if (type === 'count') return `${sign}${Math.round(abs).toLocaleString('ko-KR')}건`;
  return `${sign}${Math.round(abs).toLocaleString('ko-KR')}`;
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) return '';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const getMonthLabel = (month) => {
  return `${month}월`;
};

export const getWeekLabel = (week) => {
  return `${week}주차`;
};
