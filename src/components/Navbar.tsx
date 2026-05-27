import type { MainTab, ViewTab } from '../types/todo';

const MAIN_TABS: { value: MainTab; icon: string; text: string }[] = [
  { value: 'write', icon: 'fa-solid fa-pen-to-square', text: '일지 작성' },
  { value: 'view',  icon: 'fa-solid fa-list-check',    text: '일지 조회' },
];

const VIEW_TABS: { value: ViewTab; icon: string; text: string }[] = [
  { value: 'all',   icon: 'fa-solid fa-list',            text: '전체 목록' },
  { value: 'date',  icon: 'fa-regular fa-calendar-days', text: '날짜별 조회' },
  { value: 'stats', icon: 'fa-solid fa-chart-pie',       text: '통계' },
];

interface Props {
  onSave:     () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  connected:  boolean;
  mainTab:    MainTab;
  onMainTab:  (tab: MainTab) => void;
  viewTab:    ViewTab;
  onViewTab:  (tab: ViewTab) => void;
}

export default function Navbar({
  onSave, saveStatus, connected,
  mainTab, onMainTab, viewTab, onViewTab,
}: Props) {
  return (
    <header className="site-header">

      {/* ── 브랜드 바 ── */}
      <div className="navbar">
        <div className="nav-brand">
          <i className="fa-solid fa-book-open-reader nav-icon" />
          <div className="nav-titles">
            <span className="nav-title">업무 일지</span>
            <span className="nav-subtitle">KDN 미터링시스템부</span>
          </div>
        </div>

        <div className="nav-actions">
          <span className={`conn-badge ${connected ? 'online' : 'offline'}`}>
            <i className={connected ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} />
            {connected ? 'Supabase 연결됨' : '연결 오류'}
          </span>
          <button
            className={`btn-save ${saveStatus !== 'idle' ? saveStatus : ''}`}
            onClick={onSave}
            title="Supabase에서 최신 데이터 동기화"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <><i className="fa-solid fa-arrows-rotate fa-spin" /> 동기화 중…</>
            ) : saveStatus === 'saved' ? (
              <><i className="fa-solid fa-check" /> 동기화 완료</>
            ) : (
              <><i className="fa-solid fa-arrows-rotate" /> 동기화</>
            )}
          </button>
        </div>
      </div>

      {/* ── 메인 메뉴 ── */}
      <nav className="nav-menu">
        <div className="container">
          {MAIN_TABS.map(({ value, icon, text }) => (
            <button
              key={value}
              className={`nav-menu-tab${mainTab === value ? ' active' : ''}`}
              onClick={() => onMainTab(value)}
            >
              <i className={icon} /> {text}
            </button>
          ))}
        </div>
      </nav>

      {/* ── 서브 메뉴 (일지 조회 전용) ── */}
      {mainTab === 'view' && (
        <div className="nav-submenu">
          <div className="container">
            {VIEW_TABS.map(({ value, icon, text }) => (
              <button
                key={value}
                className={`nav-sub-tab${viewTab === value ? ' active' : ''}`}
                onClick={() => onViewTab(value)}
              >
                <i className={icon} /> {text}
              </button>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}
