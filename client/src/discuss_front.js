import React, { useState, useEffect } from 'react';
import './Payment_front.css';

const CATEGORIES = ['General', 'Mentorship', 'Success Story', 'Training'];

function Discuss_front() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ title: '', content: '', category: 'General' });
  const [commentText, setCommentText] = useState({});
  const [openPost, setOpenPost] = useState(null);
  const [resp, setResp] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const url = category ? `/api/forum?category=${category}` : '/api/forum';
      const res = await fetch(url);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPosts(); }, [category]);

  const handleNewPost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResp({ status: res.status, data });
      if (res.ok) {
        setForm({ title: '', content: '', category: 'General' });
        fetchPosts();
      }
    } catch (err) {
      setResp({ status: 0, data: { message: err.message } });
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId] || '';
    if (!text.trim()) return;
    try {
      const res = await fetch(`/api/forum/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        setCommentText({ ...commentText, [postId]: '' });
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="site-root">
      <header className="topbar">
        <div className="container nav">
          <div className="brand">Rural Women Entrepreneurship</div>
          <nav className="nav-links">
            <a href="/products">Products</a>
            <a href="/login">Login</a>
            <a className="btn-register" href="/register">Register</a>
          </nav>
        </div>
      </header>

      <main className="page container" style={{ flexDirection: 'column', gap: '24px' }}>

        {/* ── New Post ── */}
        <div className="card" style={{ width: '100%', maxWidth: '640px' }}>
          <h2 className="card-title">Community Forum</h2>
          <form className="form" onSubmit={handleNewPost}>
            <label className="label">Title</label>
            <input className="input" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />

            <label className="label">Category</label>
            <select className="input" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <label className="label">Content</label>
            <textarea className="input" rows={4} value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              style={{ resize: 'vertical' }} required />

            <button className="primary-btn" type="submit">Post</button>
          </form>
          {resp && (
            <div className="response">
              <h4>Response ({resp.status})</h4>
              <pre>{JSON.stringify(resp.data, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* ── Filter + Posts ── */}
        <div className="card" style={{ width: '100%', maxWidth: '640px' }}>
          <h2 className="card-title">Discussion Board</h2>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {['', ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCategory(c)} className="primary-btn"
                style={{ padding: '6px 14px', marginTop: 0, opacity: category === c ? 1 : 0.5 }}>
                {c || 'All'}
              </button>
            ))}
          </div>

          {posts.length === 0
            ? <p style={{ color: '#888', textAlign: 'center' }}>No posts yet. Be the first!</p>
            : posts.map(p => (
              <div key={p._id} className="response" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: '15px' }}>{p.title}</strong>
                  <span style={{ fontSize: '11px', background: '#e9f7ee', borderRadius: '4px',
                    padding: '2px 6px', color: '#2da84a', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {p.category}
                  </span>
                </div>
                <p style={{ margin: '6px 0', fontSize: '13px', color: '#47585a' }}>{p.content}</p>
                <span style={{ fontSize: '11px', color: '#999' }}>
                  By {p.user?.name || 'Unknown'} · {new Date(p.createdAt).toLocaleDateString()}
                </span>

                {/* Comments */}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => setOpenPost(openPost === p._id ? null : p._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--green)',
                      cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: 0 }}>
                    💬 {p.comments?.length || 0} Comment{p.comments?.length !== 1 ? 's' : ''} {openPost === p._id ? '▲' : '▼'}
                  </button>

                  {openPost === p._id && (
                    <div style={{ marginTop: '8px' }}>
                      {p.comments?.map((c, i) => (
                        <div key={i} style={{ padding: '6px 0', borderTop: '1px solid #e6e9eb',
                          fontSize: '13px' }}>
                          <strong>{c.user?.name || 'User'}:</strong> {c.text}
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <input className="input" style={{ flex: 1 }} placeholder="Write a comment…"
                          value={commentText[p._id] || ''}
                          onChange={e => setCommentText({ ...commentText, [p._id]: e.target.value })} />
                        <button className="primary-btn"
                          style={{ width: 'auto', padding: '0 16px', marginTop: 0 }}
                          onClick={() => handleComment(p._id)}>
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>

      </main>
    </div>
  );
}

export default Discuss_front;
