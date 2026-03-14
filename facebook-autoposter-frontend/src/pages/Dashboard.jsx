import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import PostList from "../components/PostList";

const STORAGE_KEY = "fb_autoposter_user_id";

export default function Dashboard() {
  const [userId, setUserId] = useState(localStorage.getItem(STORAGE_KEY) || "");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchPosts();
  }, [userId]);

  async function fetchPosts() {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/api/posts?userId=${userId}`);
      setPosts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveUserId() {
    localStorage.setItem(STORAGE_KEY, userId);
    fetchPosts();
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="View your scheduled and posted Facebook content." />

      <div className="card">
        <div className="field">
          <label>User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Paste the backend user id here"
          />
        </div>
        <button onClick={handleSaveUserId}>Save user id</button>
      </div>

      {loading ? <p>Loading posts...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <PostList posts={posts} />
    </div>
  );
}