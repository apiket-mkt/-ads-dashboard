import { useState } from 'react';
import { getBrands } from '../utils/parseData';
import { formatKRW, parseKRW } from '../utils/formatters';

export default function SettingsPage({ rows, targets, onSave }) {
  const brands = getBrands(rows, null);
  const [localTargets, setLocalTargets] = useState(() => {
    const init = {};
    brands.forEach((b) => {
      init[b] = targets[b] ? String(targets[b]) : '';
    });
    return init;
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (brand, value) => {
    const num = value.replace(/[^0-9]/g, '');
    setLocalTargets((prev) => ({ ...prev, [brand]: num }));
    setSaved(false);
  };

  const handleSave = () => {
    const result = {};
    Object.entries(localTargets).forEach(([brand, val]) => {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num > 0) result[brand] = num;
    });
    onSave(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="view-container">
      <section className="section">
        <h2 className="section-title">브랜드별 목표 DB 단가 설정</h2>
        <p className="section-desc">
          브랜드별 목표 DB 단가를 입력하면 월 결산 시 달성 여부를 자동으로 표시합니다.
          설정값은 이 기기(브라우저)에 저장됩니다.
        </p>
        <div className="settings-grid">
          {brands.map((brand) => (
            <div key={brand} className="settings-row">
              <label className="settings-label">{brand}</label>
              <div className="settings-input-wrap">
                <span className="input-prefix">₩</span>
                <input
                  className="settings-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="예: 30000"
                  value={localTargets[brand] || ''}
                  onChange={(e) => handleChange(brand, e.target.value)}
                />
              </div>
              {localTargets[brand] && (
                <span className="settings-preview">
                  목표: {formatKRW(parseInt(localTargets[brand], 10))}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="settings-actions">
          <button className={`btn-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? '✓ 저장 완료' : '저장하기'}
          </button>
        </div>
      </section>
    </div>
  );
}
