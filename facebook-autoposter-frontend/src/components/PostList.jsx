export default function PostList({ posts }) {
    if (!posts.length) {
      return <div className="card"><p>No posts found yet.</p></div>;
    }
  
    return (
      <div className="post-list">
        {posts.map((post) => (
          <div className="card" key={post._id}>
            <div className="post-meta-row">
              <strong>{post.status}</strong>
              <span>{new Date(post.scheduledFor).toLocaleString()}</span>
            </div>
            <p>{post.caption}</p>
            {post.imageUrl ? <img src={post.imageUrl} alt="Scheduled content" className="post-image" /> : null}
            {post.errorMessage ? <p className="error-text">{post.errorMessage}</p> : null}
          </div>
        ))}
      </div>
    );
  }