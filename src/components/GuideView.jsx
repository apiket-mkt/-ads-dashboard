export default function GuideView() {
  return (
    <div className="view-container">

      {/* ── 소개 ── */}
      <section className="section">
        <h2 className="section-title">📊 이 대시보드는 무엇인가요?</h2>
        <div className="card guide-intro">
          <p>
            이 대시보드는 <strong>스스로마케팅연구소</strong>가 운영하는 광고 캠페인의 성과를
            브랜드별·매체별로 정리한 리포트 화면입니다.
          </p>
          <p style={{ marginTop: '10px' }}>
            메타(페이스북/인스타그램) 리드폼 광고, 홈페이지 전환 광고, 쇼핑 광고의 결과를
            매주·매월 단위로 자동 집계하여 보여드립니다.
            별도 요청 없이도 최신 데이터를 언제든지 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* ── 기본 조작 ── */}
      <section className="section">
        <h2 className="section-title">🖱️ 화면 기본 조작</h2>
        <div className="guide-cards">
          <div className="guide-item">
            <div className="guide-item-title">월 선택</div>
            <p>화면 우측 상단의 <strong>숫자월 버튼</strong>을 클릭하면 해당 월 데이터로 전환됩니다. 데이터가 있는 월만 버튼으로 표시됩니다.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">전월 비교</div>
            <p>직전 월 데이터가 존재하면 탭 메뉴 옆에 <strong>'전월(N월) 비교 활성화'</strong> 배지가 자동으로 나타납니다. 이때 각 수치 옆에 전월 대비 증감률이 함께 표시됩니다.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">새로고침</div>
            <p>시간 표시 옆 <strong>↻ 버튼</strong>을 누르면 구글 시트에서 최신 데이터를 다시 불러옵니다. 데이터가 갱신된 경우 여기서 반영됩니다.</p>
          </div>
        </div>
      </section>

      {/* ── 탭별 설명 ── */}
      <section className="section">
        <h2 className="section-title">📑 탭별 기능 안내</h2>
        <div className="guide-cards">
          <div className="guide-item">
            <div className="guide-item-title">전체 현황</div>
            <p>전체 브랜드를 합산한 월간 KPI(광고비·DB건수·DB단가)와 주차별 추이 차트를 보여줍니다. 이번 달 광고 전체 흐름을 빠르게 파악할 때 사용하세요.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">브랜드별</div>
            <p>상단 브랜드 탭을 클릭하면 해당 브랜드만의 KPI와 주차별 추이를 볼 수 있습니다. 가맹 창업 브랜드는 DB 건수 중심, <strong>뚝딱마트</strong>는 쇼핑 전환(판매) 실적이 표시됩니다.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">매체별</div>
            <p>메타(리드폼), 구글, 카카오 등 광고 채널별 성과를 비교합니다. 어떤 매체에서 DB를 가장 효율적으로 확보하고 있는지 확인할 수 있습니다.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">설정</div>
            <p>브랜드별 <strong>목표 DB 단가</strong>를 직접 입력하는 화면입니다. 목표값을 설정하면 브랜드별 탭에서 달성/미달성 여부가 자동으로 표시됩니다. 설정값은 이 기기에 저장됩니다.</p>
          </div>
        </div>
      </section>

      {/* ── 지표 해석 ── */}
      <section className="section">
        <h2 className="section-title">🔍 주요 지표 해석법</h2>
        <div className="card">
          <table className="guide-table">
            <thead>
              <tr>
                <th>지표</th>
                <th>의미</th>
                <th>해석 방향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>광고비</strong></td>
                <td>해당 기간 실제 집행된 광고 비용</td>
                <td>예산 집행률 확인 기준</td>
              </tr>
              <tr>
                <td><strong>DB 건수</strong></td>
                <td>가맹 창업 문의가 접수된 총 건수</td>
                <td>많을수록 좋음</td>
              </tr>
              <tr>
                <td><strong>DB 단가</strong></td>
                <td>문의 1건을 받는 데 든 평균 광고비 (광고비 ÷ DB건수)</td>
                <td>낮을수록 효율적 (강조 표시)</td>
              </tr>
              <tr>
                <td><strong>전환 건수</strong></td>
                <td>쇼핑 광고에서 실제 구매가 발생한 건수</td>
                <td>많을수록 좋음 (뚝딱마트 전용)</td>
              </tr>
              <tr>
                <td><strong>전환 단가</strong></td>
                <td>구매 1건당 평균 광고비</td>
                <td>낮을수록 효율적 (뚝딱마트 전용)</td>
              </tr>
              <tr>
                <td><strong>전월비 ▲▼</strong></td>
                <td>직전 월 대비 증감률</td>
                <td>DB단가·전환단가는 ▼(감소)가 좋음, DB건수는 ▲(증가)가 좋음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="guide-notice">
          <strong>💡 DB 단가를 가장 중요하게 보세요.</strong><br />
          광고비가 높아도 DB 단가가 낮으면 효율적인 광고입니다.
          반대로 광고비가 적어도 단가가 높다면 효율이 떨어지는 상태입니다.
        </div>
      </section>

      {/* ── 목표 DB단가 ── */}
      <section className="section">
        <h2 className="section-title">🎯 목표 DB 단가란?</h2>
        <div className="card guide-intro">
          <p>
            <strong>설정 탭</strong>에서 브랜드별로 목표 DB 단가를 입력하면,
            브랜드별 탭 상단에 <strong>달성 / 미달성</strong> 배지가 자동으로 표시됩니다.
          </p>
          <p style={{ marginTop: '10px' }}>
            예를 들어 목표 단가를 <strong>30,000원</strong>으로 설정했을 때,
            실제 DB 단가가 28,000원이라면 <span style={{ color: '#059669', fontWeight: 600 }}>✓ 달성</span>,
            35,000원이라면 <span style={{ color: '#dc2626', fontWeight: 600 }}>✗ 미달성</span>으로 표시됩니다.
          </p>
          <p style={{ marginTop: '10px' }}>
            목표 단가는 <strong>이 기기(브라우저)에 저장</strong>되므로, 다른 기기에서 접속할 경우 다시 입력해야 합니다.
          </p>
        </div>
      </section>

      {/* ── 브랜드 유형 안내 ── */}
      <section className="section">
        <h2 className="section-title">🏷️ 브랜드 유형 안내</h2>
        <div className="guide-cards">
          <div className="guide-item">
            <div className="guide-item-title">가맹 창업 브랜드</div>
            <p>프랜차이즈 창업을 원하는 예비 점주의 <strong>가맹 문의(DB)</strong>를 확보하는 것이 목표입니다. DB 건수와 DB 단가를 중심으로 성과를 확인하세요.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">뚝딱마트 (쇼핑 브랜드)</div>
            <p>가맹 모집이 아닌 <strong>온라인 쇼핑몰 판매</strong>가 목적입니다. 전환 건수(구매)와 전환 단가를 중심으로 성과를 확인하세요. DB 단가 지표는 해당되지 않습니다.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <h2 className="section-title">❓ 자주 묻는 질문</h2>
        <div className="guide-cards">
          <div className="guide-item">
            <div className="guide-item-title">데이터는 언제 업데이트 되나요?</div>
            <p>담당자가 구글 시트에 데이터를 입력한 후 화면 상단의 <strong>↻ 새로고침 버튼</strong>을 누르면 즉시 반영됩니다. 일반적으로 매주 초 전주 데이터가 업데이트됩니다.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">전월 비교가 표시되지 않아요.</div>
            <p>현재 선택한 월의 <strong>직전 월 데이터가 존재하지 않으면</strong> 비교 기능이 자동으로 비활성화됩니다. 데이터가 쌓이면 자연스럽게 활성화됩니다.</p>
          </div>
          <div className="guide-item">
            <div className="guide-item-title">특정 브랜드의 데이터가 보이지 않아요.</div>
            <p>해당 월에 해당 브랜드의 광고가 집행되지 않았거나, 아직 데이터가 입력되지 않은 경우입니다. 담당자에게 확인을 요청해 주세요.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
