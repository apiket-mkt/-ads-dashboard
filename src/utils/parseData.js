import { parseKRW } from './formatters';

export const parseRows = (rawRows) => {
  return rawRows
    .filter((r) => r['월'] && r['주차'] && r['브랜드'])
    .map((r) => ({
      광고계정: r['광고계정']?.trim() || '',
      월: parseInt(r['월'], 10),
      주차: parseInt(r['주차'], 10),
      세트명: r['세트명']?.trim() || '',
      브랜드: r['브랜드']?.trim() || '',
      광고비: parseKRW(r['광고비']),
      DB갯수: parseInt(r['DB갯수'], 10) || 0,
      DB단가: parseKRW(r['DB단가']),
    }))
    .filter((r) => !isNaN(r.월) && !isNaN(r.주차));
};

export const getAvailableMonths = (rows) => {
  const months = [...new Set(rows.map((r) => r.월))].sort((a, b) => a - b);
  return months;
};

export const getBrands = (rows, month) => {
  const filtered = month ? rows.filter((r) => r.월 === month) : rows;
  return [...new Set(filtered.map((r) => r.브랜드))].sort();
};

export const getWeeks = (rows, month) => {
  const filtered = month ? rows.filter((r) => r.월 === month) : rows;
  return [...new Set(filtered.map((r) => r.주차))].sort((a, b) => a - b);
};

const calcDbUnitPrice = (totalSpend, totalDb) => {
  if (!totalDb || totalDb === 0) return 0;
  return Math.round(totalSpend / totalDb);
};

// 전체 월 결산
export const aggregateMonthly = (rows, month) => {
  const filtered = rows.filter((r) => r.월 === month);
  const totalSpend = filtered.reduce((s, r) => s + r.광고비, 0);
  const totalDb = filtered.reduce((s, r) => s + r.DB갯수, 0);
  return {
    광고비: totalSpend,
    DB갯수: totalDb,
    DB단가: calcDbUnitPrice(totalSpend, totalDb),
  };
};

// 전체 주차별 결산
export const aggregateByWeek = (rows, month) => {
  const filtered = rows.filter((r) => r.월 === month);
  const weeks = getWeeks(filtered, null);
  return weeks.map((week) => {
    const weekRows = filtered.filter((r) => r.주차 === week);
    const totalSpend = weekRows.reduce((s, r) => s + r.광고비, 0);
    const totalDb = weekRows.reduce((s, r) => s + r.DB갯수, 0);
    return {
      주차: week,
      label: `${week}주차`,
      광고비: totalSpend,
      DB갯수: totalDb,
      DB단가: calcDbUnitPrice(totalSpend, totalDb),
    };
  });
};

// 브랜드별 월 결산
export const aggregateByBrand = (rows, month) => {
  const filtered = rows.filter((r) => r.월 === month);
  const brands = getBrands(filtered, null);
  return brands.map((brand) => {
    const brandRows = filtered.filter((r) => r.브랜드 === brand);
    const totalSpend = brandRows.reduce((s, r) => s + r.광고비, 0);
    const totalDb = brandRows.reduce((s, r) => s + r.DB갯수, 0);
    return {
      브랜드: brand,
      광고비: totalSpend,
      DB갯수: totalDb,
      DB단가: calcDbUnitPrice(totalSpend, totalDb),
    };
  });
};

// 브랜드별 주차별 결산
export const aggregateByBrandWeek = (rows, month, brand) => {
  const filtered = rows.filter((r) => r.월 === month && r.브랜드 === brand);
  const weeks = getWeeks(filtered, null);
  return weeks.map((week) => {
    const weekRows = filtered.filter((r) => r.주차 === week);
    const totalSpend = weekRows.reduce((s, r) => s + r.광고비, 0);
    const totalDb = weekRows.reduce((s, r) => s + r.DB갯수, 0);
    return {
      주차: week,
      label: `${week}주차`,
      광고비: totalSpend,
      DB갯수: totalDb,
      DB단가: calcDbUnitPrice(totalSpend, totalDb),
    };
  });
};
