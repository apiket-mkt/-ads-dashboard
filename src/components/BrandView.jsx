import { useState } from 'react';
import KpiCard from './KpiCard';
import TrendChart from './TrendChart';
import DataTable from './DataTable';
import {
  aggregateByBrand,
  aggregateByBrandWeek,
  getBrands,
} from '../utils/parseData';
import { formatKRW, formatNumber, formatChangeRate } from '../utils/formatters';

export default function BrandView({ rows, month, prevMonth, targets }) {
  const brands = getBrands(rows, month);
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || '');

  const brandMonthly = aggregateByBrand(rows, month);
  const prevBrandMonthly = prevMonth ? aggregateByBrand(rows, prevMonth) : [];

  const targetMap = targets || {};

  const brandWeekly = selectedBrand
    ? aggregateByBrandWeek(rows, month, selectedBrand)
    : [];
  const prevBrandWeekly =
    prevMonth && selectedBrand
      ? aggregateByBrandWeek(rows, prevMonth, selectedBrand)
      : [];

  const selectedBrandMonthly = brandMonthly.find((b) => b.브랜드 === selectedBrand);
  const prevSelectedBrandMonthly = prevBrandMonthly.find((b) => b.브랜드 === selectedBrand);

  const spendChange =
    selectedBrandMonthly && prevSelectedBrandMonthly
      ? formatChangeRate(selectedBrandMonthly.광고비, prevSelectedBrandMonthly.광고비)
      : null;
  const dbChange =
    selectedBrandMonthly && prevSelectedBrandMonthly
      ? formatChangeRate(selectedBrandMonthly.DB갯수, prevSelectedBrandMonthly.DB갯수)
      : null;
  const unitChange =
    selectedBrandMonthly && prevSelectedBrandMonthly
      ? formatChangeRate(selectedBrandMonthly.DB단가, prevSelectedBrandMonthly.DB단가)
      : null;

  const target = selectedBrand ? targetMap[selectedBrand] : null;
  const achieved =
    target && selectedBrandMonthly ? selectedBrandMonthly.DB단가 <= target : null;

  return (
    <div className="view-container">
      {/* 브랜드 탭 */}
      <div className="brand-tabs">
        {brands.map((b) => (
          <button
            key={b}
            className={`brand-tab ${selectedBrand === b ? 'active' : ''}`}
            onClick={() => setSelectedBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {selectedBrand && selectedBrandMonthly && (
        <>
          {/* 선택 브랜드 KPI */}
          <section className="section">
            <div className="section-title-row">
              <h2 className="section-title">{selectedBrand} — {month}월 결산</h2>
              {target && (
                <span className={`badge ${achieved ? 'badge-success' : 'badge-fail'}`}>
                  목표단가 {formatKRW(target)} {achieved ? '✓ 달성' : '✗ 미달성'}
                </span>
              )}
              {!target && <span className="badge badge-neutral">목표단가 미설정</span>}
            </div>
            <div className="kpi-grid">
              <KpiCard
                label="광고비"
                value={formatKRW(selectedBrandMonthly.광고비)}
                change={spendChange}
                changeLabel="전월비"
              />
              <KpiCard
                label="DB 건수"
                value={`${formatNumber(selectedBrandMonthly.DB갯수)}건`}
                change={dbChange}
                changeLabel="전월비"
              />
              <KpiCard
                label="DB 단가"
                value={formatKRW(selectedBrandMonthly.DB단가)}
                change={unitChange}
                changeLabel="전월비"
                highlight="lower"
              />
              {target && (
                <KpiCard
                  label="목표 DB 단가"
                  value={formatKRW(target)}
                  sub={achieved ? '🎯 목표 달성' : '⚠ 목표 미달성'}
                />
              )}
            </div>
          </section>

          {/* 선택 브랜드 주차별 추이 */}
          <section className="section">
            <h2 className="section-title">주차별 추이</h2>
            <div className="card">
              <TrendChart data={brandWeekly} />
            </div>
          </section>

          {/* 선택 브랜드 주차별 테이블 */}
          <section className="section">
            <h2 className="section-title">주차별 상세 데이터</h2>
            <DataTable
              data={brandWeekly}
              previousData={prevMonth ? prevBrandWeekly : null}
              showChange={!!prevMonth}
            />
          </section>
        </>
      )}

      {/* 브랜드별 월 결산 비교 */}
      <section className="section">
        <h2 className="section-title">브랜드별 월 결산 비교</h2>
        <div className="card">
          <TrendChart data={brandMonthly} showBrand />
        </div>
        <DataTable
          data={brandMonthly}
          previousData={prevMonth ? prevBrandMonthly : null}
          showChange={!!prevMonth}
          targetMap={targetMap}
        />
      </section>
    </div>
  );
}
