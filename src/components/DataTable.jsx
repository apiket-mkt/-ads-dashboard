import { formatKRW, formatNumber, formatPercent, formatChangeRate } from '../utils/formatters';

// labelKey: 첫 번째 컬럼에 사용할 데이터 필드명 (기본: '브랜드' 또는 'label')
// labelHeader: 첫 번째 컬럼 헤더 텍스트 (기본: '브랜드' 또는 '주차')
export default function DataTable({ data, previousData, showChange, targetMap, labelKey, labelHeader }) {
  if (!data || data.length === 0) return <div className="empty-state">데이터가 없습니다.</div>;

  const hasBrand = !labelKey && ('brand' in (data[0] ?? {}) || '브랜드' in (data[0] ?? {}));
  const keyField = labelKey || (hasBrand ? '브랜드' : 'label');
  const headerLabel = labelHeader || (hasBrand ? '브랜드' : '주차');

  const getPrev = (row) => {
    if (!previousData) return null;
    return previousData.find((p) => p[keyField] === row[keyField]);
  };

  const changeCell = (current, previous, field, lowerIsBetter) => {
    if (!previous) return <td className="td-muted">-</td>;
    const rate = formatChangeRate(current[field], previous[field]);
    if (rate === null) return <td className="td-muted">-</td>;
    const good = lowerIsBetter ? rate < 0 : rate > 0;
    const cls = rate === 0 ? 'change-neutral' : good ? 'change-good' : 'change-bad';
    return (
      <td className={`change-cell ${cls}`}>
        {rate >= 0 ? '▲' : '▼'} {Math.abs(rate).toFixed(1)}%
      </td>
    );
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>{headerLabel}</th>
            <th>광고비</th>
            {showChange && <th className="th-change">전월비</th>}
            <th>DB 건수</th>
            {showChange && <th className="th-change">전월비</th>}
            <th>DB 단가</th>
            {showChange && <th className="th-change">전월비</th>}
            {targetMap && <th>목표단가</th>}
            {targetMap && <th>달성여부</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const prev = getPrev(row);
            const brandKey = row['브랜드'];
            const target = targetMap?.[brandKey];
            const achieved = target ? row.DB단가 <= target : null;
            return (
              <tr key={i}>
                <td className="td-label">{row[keyField]}</td>
                <td className="td-number">{formatKRW(row.광고비)}</td>
                {showChange && changeCell(row, prev, '광고비', false)}
                <td className="td-number">{formatNumber(row.DB갯수)}건</td>
                {showChange && changeCell(row, prev, 'DB갯수', false)}
                <td className="td-number td-emphasis">{formatKRW(row.DB단가)}</td>
                {showChange && changeCell(row, prev, 'DB단가', true)}
                {targetMap && (
                  <td className="td-number td-muted">
                    {target ? formatKRW(target) : <span className="no-target">미설정</span>}
                  </td>
                )}
                {targetMap && (
                  <td>
                    {achieved === null ? (
                      <span className="badge badge-neutral">-</span>
                    ) : achieved ? (
                      <span className="badge badge-success">목표달성</span>
                    ) : (
                      <span className="badge badge-fail">미달성</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
