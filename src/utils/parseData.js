import { parseKRW } from './formatters';

// ─── DB 시트 파싱 ───────────────────────────────────────────────────────────
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

// ─── 전환 시트 파싱 ──────────────────────────────────────────────────────────
export const parseConversionRows = (rawRows) => {
  return rawRows
    .filter((r) => r['월'] && r['브랜드'])
    .map((r) => ({
      광고채널: r['광고채널']?.trim() || '',
      월: parseInt(r['월'], 10),
      주차: parseInt(r['주차'], 10) || 0,
      세트명: r['세트명']?.trim() || '',
      브랜드: r['브랜드']?.trim() || '',
      광고비: parseKRW(r['광고비']),
      전환종류: r['전환종류']?.trim() || '',
      전환갯수: parseInt(r['전환갯수'], 10) || 0,
      전환단가: parseKRW(r['전환단가']),
    }))
    .filter((r) => !isNaN(r.월));
};

// ─── 공통 헬퍼 ───────────────────────────────────────────────────────────────
const calcUnitPrice = (spend, count) => {
  if (!count || count === 0) return 0;
  return Math.round(spend / count);
};

export const getAvailableMonths = (rows, convRows = []) => {
  const all = [
    ...rows.map((r) => r.월),
    ...convRows.map((r) => r.월),
  ];
  return [...new Set(all)].sort((a, b) => a - b);
};

export const getBrands = (rows, month) => {
  const filtered = month ? rows.filter((r) => r.월 === month) : rows;
  return [...new Set(filtered.map((r) => r.브랜드))].sort();
};

// DB 시트 + 전환 시트 통합 브랜드 목록
export const getAllBrands = (dbRows, convRows, month) => {
  const dbBrands = (month ? dbRows.filter((r) => r.월 === month) : dbRows).map((r) => r.브랜드);
  const convBrands = (month ? convRows.filter((r) => r.월 === month) : convRows).map((r) => r.브랜드);
  return [...new Set([...dbBrands, ...convBrands])].sort();
};

export const getWeeks = (rows, month) => {
  const filtered = month ? rows.filter((r) => r.월 === month) : rows;
  return [...new Set(filtered.map((r) => r.주차))].sort((a, b) => a - b);
};

// ─── 기존 DB 시트 전용 집계 (하위 호환) ────────────────────────────────────
export const aggregateMonthly = (rows, month) => {
  const filtered = rows.filter((r) => r.월 === month);
  const totalSpend = filtered.reduce((s, r) => s + r.광고비, 0);
  const totalDb = filtered.reduce((s, r) => s + r.DB갯수, 0);
  return {
    광고비: totalSpend,
    DB갯수: totalDb,
    DB단가: calcUnitPrice(totalSpend, totalDb),
  };
};

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
      DB단가: calcUnitPrice(totalSpend, totalDb),
    };
  });
};

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
      DB단가: calcUnitPrice(totalSpend, totalDb),
    };
  });
};

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
      DB단가: calcUnitPrice(totalSpend, totalDb),
    };
  });
};

// ─── 가맹문의 통합 집계 (DB 시트 + 전환시트 DB타입) ─────────────────────────
export const aggregateGamaengMonthly = (dbRows, convRows, month) => {
  const db = dbRows.filter((r) => r.월 === month);
  const conv = convRows.filter((r) => r.월 === month && r.전환종류 === 'DB');
  const totalSpend =
    db.reduce((s, r) => s + r.광고비, 0) + conv.reduce((s, r) => s + r.광고비, 0);
  const totalDb =
    db.reduce((s, r) => s + r.DB갯수, 0) + conv.reduce((s, r) => s + r.전환갯수, 0);
  return {
    광고비: totalSpend,
    DB갯수: totalDb,
    DB단가: calcUnitPrice(totalSpend, totalDb),
  };
};

export const aggregateGamaengByWeek = (dbRows, convRows, month) => {
  const db = dbRows.filter((r) => r.월 === month);
  const conv = convRows.filter((r) => r.월 === month && r.전환종류 === 'DB');
  const allWeeks = [...new Set([...db.map((r) => r.주차), ...conv.map((r) => r.주차)])].sort(
    (a, b) => a - b
  );
  return allWeeks.map((week) => {
    const dbW = db.filter((r) => r.주차 === week);
    const convW = conv.filter((r) => r.주차 === week);
    const totalSpend =
      dbW.reduce((s, r) => s + r.광고비, 0) + convW.reduce((s, r) => s + r.광고비, 0);
    const totalDb =
      dbW.reduce((s, r) => s + r.DB갯수, 0) + convW.reduce((s, r) => s + r.전환갯수, 0);
    return {
      주차: week,
      label: `${week}주차`,
      광고비: totalSpend,
      DB갯수: totalDb,
      DB단가: calcUnitPrice(totalSpend, totalDb),
    };
  });
};

export const aggregateGamaengByBrand = (dbRows, convRows, month) => {
  const brands = getAllBrands(dbRows, convRows.filter((r) => r.전환종류 === 'DB'), month);
  return brands.map((brand) => {
    const db = dbRows.filter((r) => r.월 === month && r.브랜드 === brand);
    const conv = convRows.filter(
      (r) => r.월 === month && r.브랜드 === brand && r.전환종류 === 'DB'
    );
    const spend =
      db.reduce((s, r) => s + r.광고비, 0) + conv.reduce((s, r) => s + r.광고비, 0);
    const count =
      db.reduce((s, r) => s + r.DB갯수, 0) + conv.reduce((s, r) => s + r.전환갯수, 0);
    return {
      브랜드: brand,
      광고비: spend,
      DB갯수: count,
      DB단가: calcUnitPrice(spend, count),
    };
  });
};

export const aggregateGamaengByBrandWeek = (dbRows, convRows, month, brand) => {
  const db = dbRows.filter((r) => r.월 === month && r.브랜드 === brand);
  const conv = convRows.filter(
    (r) => r.월 === month && r.브랜드 === brand && r.전환종류 === 'DB'
  );
  const allWeeks = [...new Set([...db.map((r) => r.주차), ...conv.map((r) => r.주차)])].sort(
    (a, b) => a - b
  );
  return allWeeks.map((week) => {
    const dbW = db.filter((r) => r.주차 === week);
    const convW = conv.filter((r) => r.주차 === week);
    const spend =
      dbW.reduce((s, r) => s + r.광고비, 0) + convW.reduce((s, r) => s + r.광고비, 0);
    const count =
      dbW.reduce((s, r) => s + r.DB갯수, 0) + convW.reduce((s, r) => s + r.전환갯수, 0);
    return {
      주차: week,
      label: `${week}주차`,
      광고비: spend,
      DB갯수: count,
      DB단가: calcUnitPrice(spend, count),
    };
  });
};

// ─── 쇼핑광고 집계 ───────────────────────────────────────────────────────────
export const aggregateShoppingMonthly = (convRows, month) => {
  const filtered = convRows.filter((r) => r.월 === month && r.전환종류 === '쇼핑');
  const totalSpend = filtered.reduce((s, r) => s + r.광고비, 0);
  const totalConv = filtered.reduce((s, r) => s + r.전환갯수, 0);
  return {
    광고비: totalSpend,
    전환갯수: totalConv,
    전환단가: calcUnitPrice(totalSpend, totalConv),
    hasData: filtered.length > 0,
  };
};

export const aggregateShoppingByBrandWeek = (convRows, month, brand) => {
  const filtered = convRows.filter(
    (r) => r.월 === month && r.브랜드 === brand && r.전환종류 === '쇼핑' && r.주차 > 0
  );
  const weeks = [...new Set(filtered.map((r) => r.주차))].sort((a, b) => a - b);
  return weeks.map((week) => {
    const weekRows = filtered.filter((r) => r.주차 === week);
    const totalSpend = weekRows.reduce((s, r) => s + r.광고비, 0);
    const totalConv = weekRows.reduce((s, r) => s + r.전환갯수, 0);
    return {
      주차: week,
      label: `${week}주차`,
      광고비: totalSpend,
      전환갯수: totalConv,
      전환단가: calcUnitPrice(totalSpend, totalConv),
    };
  });
};

export const aggregateShoppingByBrand = (convRows, month, brand) => {
  const filtered = convRows.filter(
    (r) => r.월 === month && r.브랜드 === brand && r.전환종류 === '쇼핑'
  );
  const totalSpend = filtered.reduce((s, r) => s + r.광고비, 0);
  const totalConv = filtered.reduce((s, r) => s + r.전환갯수, 0);
  return {
    광고비: totalSpend,
    전환갯수: totalConv,
    전환단가: calcUnitPrice(totalSpend, totalConv),
    hasData: filtered.length > 0,
  };
};

// ─── 매체별 집계 ─────────────────────────────────────────────────────────────
// 가맹문의 기준 매체 목록 (메타리드폼 + 전환시트 DB채널)
export const getChannels = (dbRows, convRows, month) => {
  const hasDb = dbRows.filter((r) => r.월 === month).length > 0;
  const convChannels = [
    ...new Set(
      convRows
        .filter((r) => r.월 === month && r.전환종류 === 'DB')
        .map((r) => r.광고채널)
    ),
  ].sort();
  return hasDb ? ['메타(리드폼)', ...convChannels] : convChannels;
};

// 매체별 가맹문의 월 결산
export const aggregateByChannel = (dbRows, convRows, month) => {
  const result = [];

  const db = dbRows.filter((r) => r.월 === month);
  const dbSpend = db.reduce((s, r) => s + r.광고비, 0);
  const dbCount = db.reduce((s, r) => s + r.DB갯수, 0);
  if (dbSpend > 0 || dbCount > 0) {
    result.push({
      광고채널: '메타(리드폼)',
      광고비: dbSpend,
      DB갯수: dbCount,
      DB단가: calcUnitPrice(dbSpend, dbCount),
    });
  }

  const convDb = convRows.filter((r) => r.월 === month && r.전환종류 === 'DB');
  const channels = [...new Set(convDb.map((r) => r.광고채널))].sort();
  channels.forEach((ch) => {
    const chRows = convDb.filter((r) => r.광고채널 === ch);
    const spend = chRows.reduce((s, r) => s + r.광고비, 0);
    const count = chRows.reduce((s, r) => s + r.전환갯수, 0);
    result.push({
      광고채널: ch,
      광고비: spend,
      DB갯수: count,
      DB단가: calcUnitPrice(spend, count),
    });
  });

  return result;
};

// 매체별 주차별 집계
export const aggregateByChannelWeek = (dbRows, convRows, month, channel) => {
  let filtered;
  let getSpend;
  let getCount;

  if (channel === '메타(리드폼)') {
    filtered = dbRows.filter((r) => r.월 === month);
    getSpend = (r) => r.광고비;
    getCount = (r) => r.DB갯수;
  } else {
    filtered = convRows.filter(
      (r) => r.월 === month && r.전환종류 === 'DB' && r.광고채널 === channel
    );
    getSpend = (r) => r.광고비;
    getCount = (r) => r.전환갯수;
  }

  const weeks = [...new Set(filtered.map((r) => r.주차))].sort((a, b) => a - b);
  return weeks.map((week) => {
    const weekRows = filtered.filter((r) => r.주차 === week);
    const totalSpend = weekRows.reduce((s, r) => s + getSpend(r), 0);
    const totalDb = weekRows.reduce((s, r) => s + getCount(r), 0);
    return {
      주차: week,
      label: `${week}주차`,
      광고비: totalSpend,
      DB갯수: totalDb,
      DB단가: calcUnitPrice(totalSpend, totalDb),
    };
  });
};

// 브랜드별 매체 비교 (가맹문의)
export const aggregateByBrandChannel = (dbRows, convRows, month, brand) => {
  const result = [];

  const db = dbRows.filter((r) => r.월 === month && r.브랜드 === brand);
  const dbSpend = db.reduce((s, r) => s + r.광고비, 0);
  const dbCount = db.reduce((s, r) => s + r.DB갯수, 0);
  if (dbSpend > 0 || dbCount > 0) {
    result.push({
      광고채널: '메타(리드폼)',
      광고비: dbSpend,
      DB갯수: dbCount,
      DB단가: calcUnitPrice(dbSpend, dbCount),
    });
  }

  const convDb = convRows.filter(
    (r) => r.월 === month && r.브랜드 === brand && r.전환종류 === 'DB'
  );
  const channels = [...new Set(convDb.map((r) => r.광고채널))].sort();
  channels.forEach((ch) => {
    const chRows = convDb.filter((r) => r.광고채널 === ch);
    const spend = chRows.reduce((s, r) => s + r.광고비, 0);
    const count = chRows.reduce((s, r) => s + r.전환갯수, 0);
    result.push({
      광고채널: ch,
      광고비: spend,
      DB갯수: count,
      DB단가: calcUnitPrice(spend, count),
    });
  });

  return result;
};
