import { useState } from "react";
import api from "../api/api";

export default function CaptionGenerator({ imageUrl, onSelectCaption }) {
  const [businessType, setBusinessType] = useState("");
  const [extraContext, setExtraContext] = useState("");
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
      setResult(null);

      const response = await api.post("/api/ai/generate-captions", {
        imageUrl,
        businessType,
        extraContext,
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
      <h3>2. AI Caption Generator</h3>
      <p>
        Upload an image first, then let AI analyze it and generate captions.
      </p>

      <div className="field">
        <label>Business type</label>
        <input
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="Example: clothing store, restaurant, phone accessories"
        />
      </div>

      <div className="field">
        <label>Extra context</label>
        <textarea
          rows="4"
          value={extraContext}
          onChange={(e) => setExtraContext(e.target.value)}
          placeholder="Optional details like price, new arrivals, promotion, brand, target use"
        />
      </div>

      <div className="grid-2">
        <div className="field">
          <label>Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="sales">Sales</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <div className="field">
          <label>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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
          placeholder="Example: women aged 18 to 35"
        />
      </div>

      <button
        type="button"
        onClick={generateCaptions}
        disabled={!imageUrl || loading}
      >
        {loading ? "Analyzing image..." : "Generate from image"}
      </button>

      {!imageUrl ? (
        <p className="error-text">Upload an image first.</p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      {result ? (
        <div className="ai-result">
          {result.imageSummary ? (
            <p>
              <strong>Image summary:</strong> {result.imageSummary}
            </p>
          ) : null}

          {result.contentType ? (
            <p>
              <strong>Content type:</strong> {result.contentType}
            </p>
          ) : null}

          <h4>Caption Options</h4>

          {result.captions?.map((item) => (
            <div className="caption-option" key={item.type}>
              <strong>{item.type}</strong>
              <p>{item.text}</p>
              <button type="button" onClick={() => onSelectCaption(item.text)}>
                Use this caption
              </button>
            </div>
          ))}

          {result.cta ? (
            <p>
              <strong>CTA:</strong> {result.cta}
            </p>
          ) : null}

          {result.bestPostingTime ? (
            <p>
              <strong>Best time:</strong> {result.bestPostingTime}
            </p>
          ) : null}

          {result.hashtags?.length ? (
            <p>
              <strong>Hashtags:</strong> {result.hashtags.join(" ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}