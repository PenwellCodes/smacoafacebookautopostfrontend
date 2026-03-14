export default function PageSelector({ pages, value, onChange }) {
    return (
      <div className="field">
        <label>Facebook Page</label>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select a page</option>
          {pages.map((page) => (
            <option key={page.pageId} value={page.pageId}>
              {page.name}
            </option>
          ))}
        </select>
      </div>
    );
  }