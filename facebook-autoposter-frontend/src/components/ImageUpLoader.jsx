import { useState } from "react";
import api from "../api/api";

export default function ImageUploader({ userId, onUploaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("image", file);

      const response = await api.post("/api/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      onUploaded(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="field">
      <label>Upload image</label>
      <input type="file" accept="image/*" onChange={handleChange} />
      {loading ? <p>Uploading image...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
}