import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatKRW } from '../utils/formatters';

const COUNT_KEYS = ['DB갯수', '전환갯수'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip-row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <span>
            {COUNT_KEYS.includes(p.dataKey)
              ? `${p.value.toLocaleString()}건`
              : formatKRW(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// xKey: X축에 사용할 데이터 필드명 (기본: showBrand ? '브랜드' : 'label')
// mode: 'gamaeng'(기본) | 'shopping'
export default function TrendChart({ data, showBrand, xKey, mode }) {
  const isShopping = mode === 'shopping';
  const tickFormatter = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v;
  };

  const xAxisKey = xKey || (showBrand ? '브랜드' : 'label');

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={tickFormatter}
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={tickFormatter}
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          yAxisId="left"
          dataKey="광고비"
          name="광고비"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
          opacity={0.85}
        />
        <Bar
          yAxisId="left"
          dataKey={isShopping ? '전환갯수' : 'DB갯수'}
          name={isShopping ? '전환 건수' : 'DB 건수'}
          fill="var(--accent)"
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
          opacity={0.75}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={isShopping ? '전환단가' : 'DB단가'}
          name={isShopping ? '전환단가' : 'DB단가'}
          stroke="var(--warning)"
          strokeWidth={2.5}
          dot={{ fill: 'var(--warning)', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
