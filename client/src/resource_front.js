import React, { useState, useEffect } from 'react';
import './Payment_front.css';

function Resource_front() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ title: '', description: '', type: 'Video', url: '' });
  const [resp, setResp] = useState(null);

  const fetchResources = async () => {
    try {
      const url = filter ? `/api/resources?type=${filter}` : '/api/resources';
      const res = await fetch(url);
      const data = await res.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchResources(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResp({ status: res.status, data });
      if (res.ok) {
        setForm({ title: '', description: '', type: 'Video', url: '' });
        fetchResources();
      }
    } catch (err) {
      setResp({ status: 0, data: { message: err.message } });
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

        {/* ── Browse Resources ── */}
        <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
          <h2 className="card-title">Training Resources</h2>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['', 'Video', 'Article'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className="primary-btn"
                style={{ flex: 1, marginTop: 0, opacity: filter === t ? 1 : 0.55 }}
              >
                {t || 'All'}
              </button>
            ))}
          </div>

          {resources.length === 0
            ? <p style={{ color: '#888', textAlign: 'center', marginTop: '12px' }}>No resources found.</p>
            : resources.map(r => (
              <div key={r._id} className="response" style={{ marginBottom: '10px' }}>
                <strong>{r.title}</strong>
                <span style={{ marginLeft: '8px', fontSize: '12px', color: '#47585a',
                  background: '#e9f7ee', borderRadius: '4px', padding: '2px 6px' }}>
                  {r.type}
                </span>
                {r.description && (
                  <p style={{ margin: '4px 0 6px', fontSize: '13px', color: '#47585a' }}>
                    {r.description}
                  </p>
                )}
                <a href={r.url} target="_blank" rel="noreferrer"
                  style={{ color: 'var(--green)', fontSize: '13px', fontWeight: '600' }}>
                  {r.type === 'Video' ? '▶ Watch Video' : '📄 Read Article'}
                </a>
              </div>
            ))
          }
        </div>

        {/* ── Add Resource ── */}
        <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
          <h2 className="card-title">Add Resource</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="label">Title</label>
            <input className="input" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />

            <label className="label">Description</label>
            <input className="input" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />

            <label className="label">Type</label>
            <select className="input" value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Video</option>
              <option>Article</option>
            </select>

            <label className="label">URL (YouTube link or article URL)</label>
            <input className="input" value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })} required />

            <button className="primary-btn" type="submit">Add Resource</button>
          </form>

          {resp && (
            <div className="response">
              <h4>Response ({resp.status})</h4>
              <pre>{JSON.stringify(resp.data, null, 2)}</pre>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Resource_front;
