export default function ClientSelector({ clients, value, onChange }) {
    return (
      <div className="field">
        <label>Client</label>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
    );
  }