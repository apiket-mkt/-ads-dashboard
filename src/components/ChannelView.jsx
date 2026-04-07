import { useState } from 'react';
import KpiCard from './KpiCard';
import TrendChart from './TrendChart';
import DataTable from './DataTable';
import {
  getChannels,
  aggregateByChannel,
  aggregateByChannelWeek,
} from '../utils/parseData';
import { formatKRW, formatNumber, formatChangeRate } from '../utils/formatters';

export default function ChannelView({ rows, convRows, month, prevMonth }) {
  const channels = getChannels(rows, convRows, month);
  const [selectedChannel, setSelectedChannel] = useState(channels[0] || '');

  // 전체 매체 비교
  const channelData = aggregateByChannel(rows, convRows, month);
  const prevChannelData = prevMonth ? aggregateByChannel(rows, convRows, prevMonth) : [];

  // 선택 매체 주차별
  const weeklyData = selectedChannel
    ? aggregateByChannelWeek(rows, convRows, month, selectedChannel)
    : [];
  const prevWeeklyData =
    prevMonth && selectedChannel
      ? aggregateByChannelWeek(rows, convRows, prevMonth, selectedChannel)
      : [];

  const selectedMonthly = channelData.find((c) => c.광고채널 === selectedChannel);
  const prevSelectedMonthly = prevChannelData.find((c) => c.광고채널 === selectedChannel);

  const spendChange =
    selectedMonthly && prevSelectedMonthly
      ? formatChangeRate(selectedMonthly.광고비, prevSelectedMonthly.광고비)
      : null;
  const dbChange =
    selectedMonthly && prevSelectedMonthly
      ? formatChangeRate(selectedMonthly.DB갯수, prevSelectedMonthly.DB갯수)
      : null;
  const unitChange =
    selectedMonthly && prevSelectedMonthly
      ? formatChangeRate(selectedMonthly.DB단가, prevSelectedMonthly.DB단가)
      : null;

  // DB단가 기준 효율 순위 (오름차순, DB갯수 0인 매체는 후순위)
  const rankedChannels = [...channelData].sort((a, b) => {
    if (a.DB갯수 === 0 && b.DB갯수 === 0) return 0;
    if (a.DB갯수 === 0) return 1;
    if (b.DB갯수 === 0) return -1;
    return a.DB단가 - b.DB단가;
  });

  return (
    <div className="view-container">
      {/* 매체 선택 버튼 */}
      <div className="brand-tabs">
        {channels.map((ch) => (
          <button
            key={ch}
            className={`brand-tab ${selectedChannel === ch ? 'active' : ''}`}
            onClick={() => setSelectedChannel(ch)}
          >
            {ch}
          </button>
        ))}
      </div>

      {selectedChannel && selectedMonthly && (
        <>
          {/* 선택 매체 KPI */}
          <section className="section">
            <h2 className="section-title">{selectedChannel} — {month}월 결산</h2>
            <div className="kpi-grid">
              <KpiCard
                label="광고비"
                value={formatKRW(selectedMonthly.광고비)}
                change={spendChange}
                changeLabel="전월비"
              />
              <KpiCard
                label="DB 건수"
                value={`${formatNumber(selectedMonthly.DB갯수)}건`}
                change={dbChange}
                changeLabel="전월비"
              />
              <KpiCard
                label="DB 단가"
                value={formatKRW(selectedMonthly.DB단가)}
                change={unitChange}
                changeLabel="전월비"
                highlight="lower"
              />
            </div>
          </section>

          {/* 선택 매체 주차별 추이 */}
          <section className="section">
            <h2 className="section-title">주차별 추이</h2>
            <div className="card">
              <TrendChart data={weeklyData} />
            </div>
          </section>

          {/* 선택 매체 주차별 테이블 */}
          <section className="section">
            <h2 className="section-title">주차별 상세 데이터</h2>
            <DataTable
              data={weeklyData}
              previousData={prevMonth ? prevWeeklyData : null}
              showChange={!!prevMonth}
            />
          </section>
        </>
      )}

      {/* 전체 매체 효율 순위 */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">매체별 DB단가 효율 비교</h2>
          <span className="section-badge">DB단가 낮을수록 효율적</span>
        </div>
        <div className="card">
          <TrendChart data={rankedChannels} xKey="광고채널" />
        </div>
        <DataTable
          data={rankedChannels}
          previousData={prevMonth ? prevChannelData : null}
          showChange={!!prevMonth}
          labelKey="광고채널"
          labelHeader="매체"
        />
      </section>
    </div>
  );
}
