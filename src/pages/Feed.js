import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(res.data);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/posts', { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setContent('');
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed-container">
      <form onSubmit={handlePost}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" required />
        <button type="submit">Post</button>
      </form>
      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <p><strong>{post.author}</strong>: {post.content}</p>
            <small>{new Date(post.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;