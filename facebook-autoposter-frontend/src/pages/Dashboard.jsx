import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import PostList from "../components/PostList";

const AGENCY_OWNER_KEY = "fb_autoposter_agency_owner_id";

export default function Dashboard() {
  const [agencyOwnerId, setAgencyOwnerId] = useState(
    localStorage.getItem(AGENCY_OWNER_KEY) || ""
  );
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/api/posts?agencyOwnerId=${agencyOwnerId}`
      );
      setPosts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [agencyOwnerId]);

  useEffect(() => {
    if (!agencyOwnerId) return;
    fetchPosts();
  }, [agencyOwnerId, fetchPosts]);

  function handleSaveAgencyOwnerId() {
    localStorage.setItem(AGENCY_OWNER_KEY, agencyOwnerId);
    fetchPosts();
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="View your scheduled and posted Facebook content."
      />

      <div className="card">
        <div className="field">
          <label>Agency Owner User ID</label>
          <input
            value={agencyOwnerId}
            onChange={(e) => setAgencyOwnerId(e.target.value)}
            placeholder="Paste the backend user id here"
          />
        </div>
        <button onClick={handleSaveAgencyOwnerId}>Save user id</button>
      </div>

      {loading ? <p>Loading posts...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <PostList posts={posts} />
    </div>
  );
}