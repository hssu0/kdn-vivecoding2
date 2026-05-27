interface Props {
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

export default function Navbar({ onSave, saveStatus }: Props) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <i className="fa-solid fa-book-open-reader nav-icon" />
        <div className="nav-titles">
          <span className="nav-title">업무 일지</span>
          <span className="nav-subtitle">KDN 미터링시스템부</span>
        </div>
      </div>

      <div className="nav-actions">
        <button
          className={`btn-save ${saveStatus !== 'idle' ? saveStatus : ''}`}
          onClick={onSave}
          title="localStorage에 저장"
        >
          {saveStatus === 'saved' ? (
            <><i className="fa-solid fa-check" /> 저장됨</>
          ) : (
            <><i className="fa-solid fa-floppy-disk" /> 저장</>
          )}
        </button>
      </div>
    </nav>
  );
}
