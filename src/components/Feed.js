import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      alert("Unauthorized. Please log in.");
      window.location.href = "/login";
    }
  };

  const handlePost = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/posts",
        { content: newPost },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewPost("");
      fetchPosts();
    } catch (err) {
      console.error("Post failed:", err);
      alert("Failed to post. Are you logged in?");
    }
  };

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleComment = async (id, content) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <h2>What's on your mind?</h2>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        rows="3"
        placeholder="Write something..."
      />
      <button onClick={handlePost}>Post</button>

      <h3>Feed</h3>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <p><strong>{post.author}</strong>: {post.content}</p>
          <p>{new Date(post.timestamp).toLocaleString()}</p>
          <button onClick={() => handleLike(post._id)}>
            ❤️ {post.likes.length}
          </button>

          <div className="comments">
            <h4>Comments</h4>
            {post.comments.map((c, i) => (
              <p key={i}>
                <strong>{c.author}:</strong> {c.content}
              </p>
            ))}
            <input
              type="text"
              placeholder="Write a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleComment(post._id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;