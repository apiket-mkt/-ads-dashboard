import { useState } from 'react';
import KpiCard from './KpiCard';
import TrendChart from './TrendChart';
import DataTable from './DataTable';
import {
  getAllBrands,
  aggregateGamaengByBrand,
  aggregateGamaengByBrandWeek,
  aggregateGamaengMonthly,
  aggregateByBrandChannel,
  aggregateShoppingByBrand,
  aggregateShoppingByBrandWeek,
} from '../utils/parseData';
import { formatKRW, formatNumber, formatChangeRate } from '../utils/formatters';

export default function BrandView({ rows, convRows, month, prevMonth, targets }) {
  const brands = getAllBrands(rows, convRows, month);
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || '');

  const brandMonthly = aggregateGamaengByBrand(rows, convRows, month);
  const prevBrandMonthly = prevMonth ? aggregateGamaengByBrand(rows, convRows, prevMonth) : [];

  const targetMap = targets || {};

  const brandWeekly = selectedBrand
    ? aggregateGamaengByBrandWeek(rows, convRows, month, selectedBrand)
    : [];
  const prevBrandWeekly =
    prevMonth && selectedBrand
      ? aggregateGamaengByBrandWeek(rows, convRows, prevMonth, selectedBrand)
      : [];

  // 선택 브랜드 매체별 비교
  const channelData = selectedBrand
    ? aggregateByBrandChannel(rows, convRows, month, selectedBrand)
    : [];

  // 선택 브랜드 쇼핑광고
  const shopping = selectedBrand
    ? aggregateShoppingByBrand(convRows, month, selectedBrand)
    : { hasData: false };

  const shoppingWeekly = shopping.hasData
    ? aggregateShoppingByBrandWeek(convRows, month, selectedBrand)
    : [];
  const prevShoppingWeekly =
    prevMonth && shopping.hasData
      ? aggregateShoppingByBrandWeek(convRows, prevMonth, selectedBrand)
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

      {selectedBrand && (
        <>
          {/* 선택 브랜드 가맹문의 KPI — 가맹문의 데이터가 있는 브랜드만 */}
          {selectedBrandMonthly && (
            <>
              <section className="section">
                <div className="section-title-row">
                  <h2 className="section-title">{selectedBrand} — {month}월 가맹문의 결산</h2>
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
                    label="통합 DB 단가"
                    value={formatKRW(selectedBrandMonthly.DB단가)}
                    change={unitChange}
                    changeLabel="전월비"
                    highlight="lower"
                  />
                  {target && (
                    <KpiCard
                      label="목표 DB 단가"
                      value={formatKRW(target)}
                      sub={achieved ? '목표 달성' : '목표 미달성'}
                    />
                  )}
                </div>
              </section>

              {/* 매체별 DB단가 비교 */}
              {channelData.length > 1 && (
                <section className="section">
                  <h2 className="section-title">매체별 DB단가 비교</h2>
                  <div className="card">
                    <TrendChart data={channelData} xKey="광고채널" />
                  </div>
                  <DataTable
                    data={channelData}
                    labelKey="광고채널"
                    labelHeader="매체"
                  />
                </section>
              )}

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

          {/* 쇼핑광고 — 가맹문의와 독립적으로 렌더 (뚝딱마트 등 판매 목적 브랜드) */}
          {shopping.hasData && (
            <>
              <section className="section section-shopping">
                <div className="section-header">
                  <h2 className="section-title">{selectedBrand} — {month}월 쇼핑광고 결산</h2>
                  <span className="section-badge section-badge-shopping">제품 판매</span>
                </div>
                <div className="kpi-grid">
                  <KpiCard label="쇼핑 광고비" value={formatKRW(shopping.광고비)} />
                  <KpiCard label="전환 건수" value={`${formatNumber(shopping.전환갯수)}건`} />
                  <KpiCard label="전환 단가" value={formatKRW(shopping.전환단가)} highlight="lower" />
                </div>
              </section>

              {shoppingWeekly.length > 0 && (
                <>
                  <section className="section">
                    <h2 className="section-title">주차별 추이</h2>
                    <div className="card">
                      <TrendChart data={shoppingWeekly} mode="shopping" />
                    </div>
                  </section>
                  <section className="section">
                    <h2 className="section-title">주차별 상세 데이터</h2>
                    <DataTable
                      data={shoppingWeekly}
                      previousData={prevMonth ? prevShoppingWeekly : null}
                      showChange={!!prevMonth}
                      mode="shopping"
                    />
                  </section>
                </>
              )}
            </>
          )}

          {/* 가맹문의도 쇼핑도 없는 경우 */}
          {!selectedBrandMonthly && !shopping.hasData && (
            <div className="empty-state">이 브랜드의 {month}월 데이터가 없습니다.</div>
          )}
        </>
      )}

      {/* 전체 브랜드 월 결산 비교 */}
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
