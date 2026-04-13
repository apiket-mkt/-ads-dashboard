import { useState, useEffect } from 'react';
import { useSheetData } from './hooks/useSheetData';
import { getAvailableMonths } from './utils/parseData';
import OverallView from './components/OverallView';
import BrandView from './components/BrandView';
import ChannelView from './components/ChannelView';
import SettingsPage from './components/SettingsPage';
import GuideView from './components/GuideView';
import './App.css';

const TABS = [
  { id: 'overall', label: '전체 현황' },
  { id: 'brand', label: '브랜드별' },
  { id: 'channel', label: '매체별' },
  { id: 'settings', label: '⚙ 설정' },
  { id: 'guide', label: '? 이용 안내' },
];

const TARGETS_KEY = 'ads_dashboard_targets';

function loadTargets() {
  try {
    return JSON.parse(localStorage.getItem(TARGETS_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function App() {
  const { rows, convRows, loading, error, refetch, lastUpdated } = useSheetData();
  const [activeTab, setActiveTab] = useState('overall');
  const [targets, setTargets] = useState(loadTargets);

  const months = getAvailableMonths(rows, convRows);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (months.length > 0 && selectedMonth === null) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [months.length]);

  const prevMonth =
    selectedMonth && months.includes(selectedMonth - 1) ? selectedMonth - 1 : null;

  const handleSaveTargets = (newTargets) => {
    setTargets(newTargets);
    localStorage.setItem(TARGETS_KEY, JSON.stringify(newTargets));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>광고 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠</div>
        <h2>데이터를 불러올 수 없습니다</h2>
        <p className="error-msg">{error}</p>
        <p className="error-hint">구글 시트가 공개 공유 상태인지 확인해주세요.</p>
        <button className="btn-retry" onClick={refetch}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">AD</div>
            <div>
              <div className="header-title">광고 성과 대시보드</div>
              <div className="header-sub">스스로마케팅연구소</div>
            </div>
          </div>

          <div className="header-controls">
            {lastUpdated && (
              <div className="last-updated">
                {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
                <button className="btn-refresh" onClick={refetch} title="데이터 새로고침">↻</button>
              </div>
            )}
            <div className="month-selector">
              {months.map((m) => (
                <button
                  key={m}
                  className={`month-btn ${selectedMonth === m ? 'active' : ''}`}
                  onClick={() => setSelectedMonth(m)}
                >
                  {m}월
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <nav className="tab-nav">
        <div className="tab-nav-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          {prevMonth && (
            <span className="compare-badge">전월({prevMonth}월) 비교 활성화</span>
          )}
        </div>
      </nav>

      <main className="main">
        {selectedMonth === null ? (
          <div className="empty-state">데이터가 없습니다.</div>
        ) : activeTab === 'overall' ? (
          <OverallView rows={rows} convRows={convRows} month={selectedMonth} prevMonth={prevMonth} />
        ) : activeTab === 'brand' ? (
          <BrandView
            rows={rows}
            convRows={convRows}
            month={selectedMonth}
            prevMonth={prevMonth}
            targets={targets}
          />
        ) : activeTab === 'channel' ? (
          <ChannelView
            rows={rows}
            convRows={convRows}
            month={selectedMonth}
            prevMonth={prevMonth}
          />
        ) : activeTab === 'settings' ? (
          <SettingsPage rows={rows} convRows={convRows} targets={targets} onSave={handleSaveTargets} />
        ) : (
          <GuideView />
        )}
      </main>
    </div>
  );
}
