import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import ImageUpLoader from "../components/ImageUpLoader";
import CaptionGenerator from "../components/CaptionGenerator";
import ClientSelector from "../components/ClientSelector";

const AGENCY_OWNER_KEY = "fb_autoposter_agency_owner_id";
const CLIENT_KEY = "fb_autoposter_client_id";

export default function CreatePost() {
  const [agencyOwnerId, setAgencyOwnerId] = useState(
    localStorage.getItem(AGENCY_OWNER_KEY) || ""
  );

  const [clientId, setClientId] = useState(
    localStorage.getItem(CLIENT_KEY) || ""
  );

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agencyOwnerId) return;

    async function fetchClients() {
      try {
        setError("");
        const response = await api.get(
          `/api/clients?agencyOwnerId=${agencyOwnerId}`
        );
        setClients(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load clients");
      }
    }

    fetchClients();
  }, [agencyOwnerId]);

  useEffect(() => {
    const client = clients.find((item) => item._id === clientId) || null;
    setSelectedClient(client);
  }, [clientId, clients]);

  async function handleCreatePost(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (!selectedClient?.pageId) {
        setError("Selected client does not have a page ID");
        return;
      }

      const response = await api.post("/api/posts", {
        agencyOwnerId,
        clientId,
        pageId: selectedClient.pageId,
        imageUrl: uploadedImage?.imageUrl,
        caption,
        scheduledFor: new Date(scheduledFor).toISOString()
      });

      setMessage(`Post created with ID: ${response.data._id}`);
      setCaption("");
      setScheduledFor("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header
        title="Create Post"
        subtitle="Upload an image, let AI analyze it, choose a caption, and schedule the post."
      />

      <div className="card">
        <div className="field">
          <label>Agency Owner User ID</label>
          <input
            value={agencyOwnerId}
            onChange={(e) => {
              const value = e.target.value;
              setAgencyOwnerId(value);
              localStorage.setItem(AGENCY_OWNER_KEY, value);
            }}
            placeholder="Paste backend agency owner id"
          />
        </div>

        <ClientSelector
          clients={clients}
          value={clientId}
          onChange={(value) => {
            setClientId(value);
            localStorage.setItem(CLIENT_KEY, value);
          }}
        />

        {selectedClient ? (
          <div className="field">
            <label>Selected Client Page</label>
            <input
              value={
                selectedClient.pageName
                  ? `${selectedClient.pageName} (${selectedClient.pageId || "No Page ID"})`
                  : selectedClient.pageId || "No Page ID"
              }
              readOnly
            />
          </div>
        ) : null}
      </div>

      <div className="card">
        <h3>1. Upload Image</h3>

        <ImageUpLoader
          userId={agencyOwnerId}
          onUploaded={(file) => {
            setUploadedImage(file);
            setMessage("Image uploaded successfully");
            setError("");
          }}
        />

        {uploadedImage?.imageUrl ? (
          <div className="preview-box">
            <img
              src={uploadedImage.imageUrl}
              alt="Uploaded preview"
              className="post-image"
            />
          </div>
        ) : null}
      </div>

      <CaptionGenerator
        imageUrl={uploadedImage?.imageUrl}
        onSelectCaption={setCaption}
      />

      <form className="card" onSubmit={handleCreatePost}>
        <h3>3. Finalize Post</h3>

        <div className="field">
          <label>Caption</label>
          <textarea
            rows="6"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Generate a caption from the uploaded image or type your own"
          />
        </div>

        <div className="field">
          <label>Schedule date and time</label>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            !agencyOwnerId ||
            !clientId ||
            !selectedClient?.pageId ||
            !uploadedImage?.imageUrl ||
            !caption ||
            !scheduledFor
          }
        >
          {loading ? "Creating post..." : "Create scheduled post"}
        </button>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </form>
    </div>
  );
}