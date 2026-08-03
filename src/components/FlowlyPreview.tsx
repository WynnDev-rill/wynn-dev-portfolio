interface FlowlyPreviewProps {
  compact?: boolean;
}

export function FlowlyPreview({ compact = false }: FlowlyPreviewProps) {
  return (
    <div className={`flowly-preview ${compact ? "is-compact" : ""}`} role="img" aria-label="Preview antarmuka Flowly berdasarkan source aplikasi">
      <div className="flowly-aura aura-one" />
      <div className="flowly-aura aura-two" />
      <div className="flowly-phone">
        <div className="flowly-topline"><span>FLOWLY</span><span>•••</span></div>
        <div className="flowly-greeting">
          <small>Hari ini</small>
          <strong>Selamat datang, Wynn</strong>
          <p>Tiga langkah kecil untuk perhatian yang lebih jernih.</p>
        </div>
        <div className="flowly-progress-row">
          <div className="flowly-progress"><span>0%</span></div>
          <div><small>Ritme hari ini</small><strong>0 dari 3 selesai</strong></div>
        </div>
        <div className="flowly-missions">
          {[
            ["01", "Melihat", "Perhatikan satu detail baru"],
            ["02", "Menyadari", "Tangkap perubahan kecil"],
            ["03", "Mengingat", "Bawa kesadaran itu kembali"],
          ].map(([number, title, copy]) => (
            <div className="flowly-mission" key={number}>
              <span>{number}</span><div><strong>{title}</strong><small>{copy}</small></div><b>↗</b>
            </div>
          ))}
        </div>
        <div className="flowly-nav"><span>●</span><span>◇</span><span>⌁</span><span>○</span></div>
      </div>
      <span className="source-preview-label">SOURCE-RENDERED PREVIEW</span>
    </div>
  );
}
