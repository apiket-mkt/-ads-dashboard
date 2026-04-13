export default function KpiCard({ label, value, sub, change, changeDiff, changeLabel, highlight }) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const changeColor = highlight === 'lower'
    ? (isNegative ? 'var(--success)' : isPositive ? 'var(--danger)' : 'var(--text-muted)')
    : (isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-muted)');

  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {change !== null && change !== undefined && !isNaN(change) && (
        <div className="kpi-change" style={{ color: changeColor }}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
          {changeDiff && <span className="kpi-change-diff"> ({changeDiff})</span>}
          {changeLabel && <span className="kpi-change-label"> {changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
