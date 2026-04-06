import KpiCard from './KpiCard';
import TrendChart from './TrendChart';
import DataTable from './DataTable';
import {
  aggregateMonthly,
  aggregateByWeek,
} from '../utils/parseData';
import { formatKRW, formatNumber, formatChangeRate } from '../utils/formatters';

export default function OverallView({ rows, month, prevMonth }) {
  const monthly = aggregateMonthly(rows, month);
  const prevMonthly = prevMonth ? aggregateMonthly(rows, prevMonth) : null;
  const weeklyData = aggregateByWeek(rows, month);
  const prevWeeklyData = prevMonth ? aggregateByWeek(rows, prevMonth) : [];

  const spendChange = prevMonthly
    ? formatChangeRate(monthly.광고비, prevMonthly.광고비)
    : null;
  const dbChange = prevMonthly
    ? formatChangeRate(monthly.DB갯수, prevMonthly.DB갯수)
    : null;
  const unitChange = prevMonthly
    ? formatChangeRate(monthly.DB단가, prevMonthly.DB단가)
    : null;

  return (
    <div className="view-container">
      {/* 월 전체 KPI */}
      <section className="section">
        <h2 className="section-title">{month}월 전체 결산</h2>
        <div className="kpi-grid">
          <KpiCard
            label="총 광고비"
            value={formatKRW(monthly.광고비)}
            change={spendChange}
            changeLabel="전월비"
          />
          <KpiCard
            label="총 DB 건수"
            value={`${formatNumber(monthly.DB갯수)}건`}
            change={dbChange}
            changeLabel="전월비"
          />
          <KpiCard
            label="평균 DB 단가"
            value={formatKRW(monthly.DB단가)}
            change={unitChange}
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
    </div>
  );
}
