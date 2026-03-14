import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import PageSelector from "../components/PageSelector";
import ImageUploader from "../components/ImageUpLoader";
import CaptionGenerator from "../components/CaptionGenerator";

const STORAGE_KEY = "fb_autoposter_user_id";

export default function CreatePost() {

  const [userId, setUserId] = useState(
    localStorage.getItem(STORAGE_KEY) || ""
  );

  const [pages, setPages] = useState([]);
  const [pageId, setPageId] = useState("");

  const [uploadedImage, setUploadedImage] = useState(null);

  const [caption, setCaption] = useState("");

  const [scheduledFor, setScheduledFor] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetchPages();
  }, [userId]);

  async function fetchPages() {
    try {

      const response = await api.get(`/api/pages?userId=${userId}`);

      setPages(response.data);

    } catch (err) {

      setError(
        err.response?.data?.message || "Failed to load pages"
      );

    }
  }

  async function handleCreatePost(event) {

    event.preventDefault();

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post("/api/posts", {
        userId,
        pageId,
        imageUrl: uploadedImage?.imageUrl,
        caption,
        scheduledFor: new Date(scheduledFor).toISOString()
      });

      setMessage(`Post created with ID: ${response.data._id}`);

      setCaption("");
      setScheduledFor("");

    } catch (err) {

      setError(
        err.response?.data?.message || "Failed to create post"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <div>

      <Header
        title="Create Post"
        subtitle="Upload an image, generate a caption, and schedule a Facebook post."
      />

      <div className="card">

        <div className="field">

          <label>User ID</label>

          <input
            value={userId}
            onChange={(e) => {

              const value = e.target.value;

              setUserId(value);

              localStorage.setItem(STORAGE_KEY, value);

            }}
            placeholder="Paste backend user id"
          />

        </div>

      </div>

      <CaptionGenerator
        onSelectCaption={(text) => setCaption(text)}
      />

      <form className="card" onSubmit={handleCreatePost}>

        <PageSelector
          pages={pages}
          value={pageId}
          onChange={setPageId}
        />

        <ImageUploader
          userId={userId}
          onUploaded={(file) => {

            setUploadedImage(file);

            setMessage("Image uploaded successfully");

          }}
        />

        {uploadedImage?.imageUrl && (

          <div>

            <img
              src={uploadedImage.imageUrl}
              alt="preview"
              className="post-image"
            />

          </div>

        )}

        <div className="field">

          <label>Caption</label>

          <textarea
            rows="5"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write or generate caption"
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
            !userId ||
            !pageId ||
            !uploadedImage?.imageUrl ||
            !scheduledFor
          }
        >
          {loading ? "Creating post..." : "Create scheduled post"}
        </button>

        {message && (
          <p className="success-text">{message}</p>
        )}

        {error && (
          <p className="error-text">{error}</p>
        )}

      </form>

    </div>
  );
}