import KpiCard from './KpiCard';
import TrendChart from './TrendChart';
import DataTable from './DataTable';
import {
  aggregateGamaengMonthly,
  aggregateGamaengByWeek,
  aggregateShoppingMonthly,
} from '../utils/parseData';
import { formatKRW, formatNumber, formatChangeRate, formatDiff } from '../utils/formatters';

export default function OverallView({ rows, convRows, month, prevMonth }) {
  // 가맹문의 통합 (DB 시트 + 전환시트 DB타입)
  const monthly = aggregateGamaengMonthly(rows, convRows, month);
  const prevMonthly = prevMonth ? aggregateGamaengMonthly(rows, convRows, prevMonth) : null;
  const weeklyData = aggregateGamaengByWeek(rows, convRows, month);
  const prevWeeklyData = prevMonth ? aggregateGamaengByWeek(rows, convRows, prevMonth) : [];

  // 쇼핑광고
  const shopping = aggregateShoppingMonthly(convRows, month);
  const prevShopping = prevMonth ? aggregateShoppingMonthly(convRows, prevMonth) : null;

  const spendChange = prevMonthly ? formatChangeRate(monthly.광고비, prevMonthly.광고비) : null;
  const dbChange = prevMonthly ? formatChangeRate(monthly.DB갯수, prevMonthly.DB갯수) : null;
  const unitChange = prevMonthly ? formatChangeRate(monthly.DB단가, prevMonthly.DB단가) : null;

  const spendDiff = prevMonthly ? formatDiff(monthly.광고비, prevMonthly.광고비, 'krw') : null;
  const dbDiff = prevMonthly ? formatDiff(monthly.DB갯수, prevMonthly.DB갯수, 'count') : null;
  const unitDiff = prevMonthly ? formatDiff(monthly.DB단가, prevMonthly.DB단가, 'krw') : null;

  const shopSpendChange = prevShopping?.hasData
    ? formatChangeRate(shopping.광고비, prevShopping.광고비)
    : null;
  const shopConvChange = prevShopping?.hasData
    ? formatChangeRate(shopping.전환갯수, prevShopping.전환갯수)
    : null;
  const shopUnitChange = prevShopping?.hasData
    ? formatChangeRate(shopping.전환단가, prevShopping.전환단가)
    : null;

  const shopSpendDiff = prevShopping?.hasData
    ? formatDiff(shopping.광고비, prevShopping.광고비, 'krw')
    : null;
  const shopConvDiff = prevShopping?.hasData
    ? formatDiff(shopping.전환갯수, prevShopping.전환갯수, 'count')
    : null;
  const shopUnitDiff = prevShopping?.hasData
    ? formatDiff(shopping.전환단가, prevShopping.전환단가, 'krw')
    : null;

  return (
    <div className="view-container">
      {/* 가맹문의 통합 KPI */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{month}월 가맹문의 광고 결산</h2>
          <span className="section-badge">메타 리드폼 + 랜딩전환 통합</span>
        </div>
        <div className="kpi-grid">
          <KpiCard
            label="총 광고비"
            value={formatKRW(monthly.광고비)}
            change={spendChange}
            changeDiff={spendDiff}
            changeLabel="전월비"
          />
          <KpiCard
            label="총 DB 건수"
            value={`${formatNumber(monthly.DB갯수)}건`}
            change={dbChange}
            changeDiff={dbDiff}
            changeLabel="전월비"
          />
          <KpiCard
            label="통합 DB 단가"
            value={formatKRW(monthly.DB단가)}
            change={unitChange}
            changeDiff={unitDiff}
            changeLabel="전월비"
            highlight="lower"
          />
          {prevMonthly && (
            <KpiCard
              label="전월 DB 단가"
              value={formatKRW(prevMonthly.DB단가)}
              sub={`${prevMonth}월 기준`}
            />
          )}
        </div>
      </section>

      {/* 주차별 추이 차트 */}
      <section className="section">
        <h2 className="section-title">주차별 추이</h2>
        <div className="card">
          <TrendChart data={weeklyData} />
        </div>
      </section>

      {/* 주차별 데이터 테이블 */}
      <section className="section">
        <h2 className="section-title">주차별 상세 데이터</h2>
        <DataTable
          data={weeklyData}
          previousData={prevMonth ? prevWeeklyData : null}
          showChange={!!prevMonth}
        />
      </section>

      {/* 쇼핑광고 KPI (데이터 있을 때만) */}
      {shopping.hasData && (
        <section className="section section-shopping">
          <div className="section-header">
            <h2 className="section-title">{month}월 쇼핑광고 결산</h2>
            <span className="section-badge section-badge-shopping">제품 판매</span>
          </div>
          <div className="kpi-grid">
            <KpiCard
              label="쇼핑 광고비"
              value={formatKRW(shopping.광고비)}
              change={shopSpendChange}
              changeDiff={shopSpendDiff}
              changeLabel="전월비"
            />
            <KpiCard
              label="전환 건수"
              value={`${formatNumber(shopping.전환갯수)}건`}
              change={shopConvChange}
              changeDiff={shopConvDiff}
              changeLabel="전월비"
            />
            <KpiCard
              label="전환 단가"
              value={formatKRW(shopping.전환단가)}
              change={shopUnitChange}
              changeDiff={shopUnitDiff}
              changeLabel="전월비"
              highlight="lower"
            />
          </div>
        </section>
      )}
    </div>
  );
}
