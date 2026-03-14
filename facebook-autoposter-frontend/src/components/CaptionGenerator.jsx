import { useState } from "react";
import api from "../api/api";

export default function CaptionGenerator({ onSelectCaption }) {
  const [businessType, setBusinessType] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [tone, setTone] = useState("sales");
  const [targetAudience, setTargetAudience] = useState("general customers");
  const [language, setLanguage] = useState("English");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function generateCaptions() {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/api/ai/generate-captions", {
        businessType,
        productDescription,
        tone,
        targetAudience,
        language
      });

      setResult(response.data);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate captions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">

      <h3>AI Caption Generator</h3>

      <div className="field">
        <label>Business type</label>
        <input
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="example: clothing store"
        />
      </div>

      <div className="field">
        <label>Product description</label>
        <textarea
          rows="4"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Describe the product or promotion"
        />
      </div>

      <div className="grid-2">

        <div className="field">
          <label>Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="sales">Sales</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <div className="field">
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Siswati">Siswati</option>
          </select>
        </div>

      </div>

      <div className="field">
        <label>Target audience</label>
        <input
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="example: women aged 18–35"
        />
      </div>

      <button
        onClick={generateCaptions}
        disabled={!businessType || !productDescription || loading}
      >
        {loading ? "Generating..." : "Generate captions"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div>

          <h4>Caption Options</h4>

          {result.captions?.map((item) => (
            <div key={item.type} className="caption-option">

              <strong>{item.type}</strong>

              <p>{item.text}</p>

              <button
                onClick={() => onSelectCaption(item.text)}
              >
                Use this caption
              </button>

            </div>
          ))}

          {result.cta && (
            <p><strong>CTA:</strong> {result.cta}</p>
          )}

          {result.bestPostingTime && (
            <p><strong>Best time:</strong> {result.bestPostingTime}</p>
          )}

          {result.hashtags && (
            <p>
              <strong>Hashtags:</strong>{" "}
              {result.hashtags.join(" ")}
            </p>
          )}

        </div>
      )}

    </div>
  );
}