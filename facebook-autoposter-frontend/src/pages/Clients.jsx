import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";

const AGENCY_OWNER_KEY = "fb_autoposter_agency_owner_id";

export default function Clients() {
  const [agencyOwnerId, setAgencyOwnerId] = useState(
    localStorage.getItem(AGENCY_OWNER_KEY) || ""
  );

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    industry: "",
    contactName: "",
    email: "",
    phone: "",
    pageId: "",
    pageName: ""
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/clients?agencyOwnerId=${agencyOwnerId}`
      );

      setClients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [agencyOwnerId]);

  useEffect(() => {
    if (!agencyOwnerId) return;
    fetchClients();
  }, [agencyOwnerId, fetchClients]);

  async function handleCreateClient(event) {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await api.post("/api/clients", {
        agencyOwnerId,
        ...form
      });

      setClients((prev) => [response.data, ...prev]);

      setForm({
        name: "",
        industry: "",
        contactName: "",
        email: "",
        phone: "",
        pageId: "",
        pageName: ""
      });

      setMessage("Client created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create client");
    }
  }

  function handleSaveAgencyOwnerId() {
    localStorage.setItem(AGENCY_OWNER_KEY, agencyOwnerId);
    fetchClients();
  }

  return (
    <div>
      <Header
        title="Clients"
        subtitle="Manage the businesses you create content for."
      />

      <div className="card">
        <div className="field">
          <label>Agency Owner User ID</label>
          <input
            value={agencyOwnerId}
            onChange={(e) => setAgencyOwnerId(e.target.value)}
            placeholder="Paste backend agency owner id"
          />
        </div>

        <button onClick={handleSaveAgencyOwnerId}>Save user id</button>
      </div>

      <form className="card" onSubmit={handleCreateClient}>
        <h3>Add Client</h3>

        <div className="grid-2">
          <div className="field">
            <label>Business Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Example: SMACOA AI Solutions"
              required
            />
          </div>

          <div className="field">
            <label>Industry</label>
            <input
              value={form.industry}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, industry: e.target.value }))
              }
              placeholder="Example: AI consulting"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Contact Name</label>
            <input
              value={form.contactName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contactName: e.target.value }))
              }
              placeholder="Client contact person"
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="field">
          <label>Phone</label>
          <input
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="+268..."
          />
        </div>

        <div className="grid-2">
          <div className="field">
            <label>Facebook Page ID</label>
            <input
              value={form.pageId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pageId: e.target.value }))
              }
              placeholder="Example: 1039963672532325"
            />
          </div>

          <div className="field">
            <label>Facebook Page Name</label>
            <input
              value={form.pageName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pageName: e.target.value }))
              }
              placeholder="Example: Smacoa"
            />
          </div>
        </div>

        <button type="submit" disabled={!agencyOwnerId || !form.name}>
          Create client
        </button>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </form>

      <div className="card">
        <h3>Client List</h3>

        {loading ? <p>Loading clients...</p> : null}
        {!loading && clients.length === 0 ? <p>No clients yet.</p> : null}

        <div className="post-list">
          {clients.map((client) => (
            <div className="card" key={client._id}>
              <div className="post-meta-row">
                <strong>{client.name}</strong>
                <span>{client.status}</span>
              </div>

              {client.industry ? (
                <p><strong>Industry:</strong> {client.industry}</p>
              ) : null}

              {client.pageName ? (
                <p><strong>Page Name:</strong> {client.pageName}</p>
              ) : null}

              {client.pageId ? (
                <p><strong>Page ID:</strong> {client.pageId}</p>
              ) : null}

              {client.contactName ? (
                <p><strong>Contact:</strong> {client.contactName}</p>
              ) : null}

              {client.email ? (
                <p><strong>Email:</strong> {client.email}</p>
              ) : null}

              {client.phone ? (
                <p><strong>Phone:</strong> {client.phone}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}