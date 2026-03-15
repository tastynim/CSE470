import React, { useState, useEffect } from 'react';
import './Payment_front.css';

function Mentor_front() {
  const [tab, setTab] = useState('browse');   // browse | sent | incoming
  const [mentors, setMentors] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [form, setForm] = useState({ mentorId: '', message: '' });
  const [resp, setResp] = useState(null);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/mentorship/mentors');
      const data = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchSent = async () => {
    try {
      const res = await fetch('/api/mentorship/my-requests', { headers: authHeader });
      const data = await res.json();
      setSentRequests(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchIncoming = async () => {
    try {
      const res = await fetch('/api/mentorship/incoming', { headers: authHeader });
      const data = await res.json();
      setIncomingRequests(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMentors();
    fetchSent();
    fetchIncoming();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mentorship/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResp({ status: res.status, data });
      if (res.ok) { setForm({ mentorId: '', message: '' }); fetchSent(); }
    } catch (err) {
      setResp({ status: 0, data: { message: err.message } });
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/mentorship/request/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchIncoming();
    } catch (err) { console.error(err); }
  };

  const statusColor = { Pending: '#f59e0b', Accepted: '#2da84a', Rejected: '#ef4444' };

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
        <div className="card" style={{ width: '100%', maxWidth: '640px' }}>
          <h2 className="card-title">Mentorship</h2>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[['browse', 'Find a Mentor'], ['sent', 'My Requests'], ['incoming', 'Incoming']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className="primary-btn"
                style={{ flex: 1, marginTop: 0, opacity: tab === key ? 1 : 0.5 }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Browse Mentors ── */}
          {tab === 'browse' && (
            <>
              {mentors.length === 0
                ? <p style={{ color: '#888', textAlign: 'center' }}>No mentors available.</p>
                : mentors.map(m => (
                  <div key={m._id} className="response" style={{ marginBottom: '10px' }}>
                    <strong>{m.name}</strong>
                    {m.location && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#888' }}>📍 {m.location}</span>}
                    {m.skills?.length > 0 && (
                      <p style={{ margin: '4px 0', fontSize: '12px', color: '#47585a' }}>
                        Skills: {m.skills.join(', ')}
                      </p>
                    )}
                    <button className="primary-btn"
                      style={{ marginTop: '8px', padding: '6px 14px', width: 'auto' }}
                      onClick={() => { setForm({ ...form, mentorId: m._id }); setTab('request'); }}>
                      Request Mentorship
                    </button>
                  </div>
                ))
              }

              {/* Quick request form */}
              <div style={{ borderTop: '1px solid #e6e9eb', marginTop: '16px', paddingTop: '16px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Send a Request</h3>
                <form className="form" onSubmit={handleRequest}>
                  <label className="label">Mentor ID</label>
                  <input className="input" placeholder="Paste Mentor ID or select above"
                    value={form.mentorId} onChange={e => setForm({ ...form, mentorId: e.target.value })} required />

                  <label className="label">Message (optional)</label>
                  <textarea className="input" rows={3} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ resize: 'vertical' }} />

                  <button className="primary-btn" type="submit">Send Request</button>
                </form>
                {resp && (
                  <div className="response" style={{ marginTop: '10px' }}>
                    <h4>Response ({resp.status})</h4>
                    <pre>{JSON.stringify(resp.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Sent Requests ── */}
          {tab === 'sent' && (
            sentRequests.length === 0
              ? <p style={{ color: '#888', textAlign: 'center' }}>No requests sent yet.</p>
              : sentRequests.map(r => (
                <div key={r._id} className="response" style={{ marginBottom: '10px' }}>
                  <strong>{r.mentor?.name || 'Mentor'}</strong>
                  <span style={{ marginLeft: '10px', fontSize: '12px', fontWeight: '700',
                    color: statusColor[r.status] || '#333' }}>● {r.status}</span>
                  {r.message && <p style={{ margin: '4px 0', fontSize: '13px', color: '#47585a' }}>{r.message}</p>}
                  <span style={{ fontSize: '11px', color: '#999' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
          )}

          {/* ── Incoming Requests ── */}
          {tab === 'incoming' && (
            incomingRequests.length === 0
              ? <p style={{ color: '#888', textAlign: 'center' }}>No incoming requests.</p>
              : incomingRequests.map(r => (
                <div key={r._id} className="response" style={{ marginBottom: '10px' }}>
                  <strong>{r.mentee?.name || 'Mentee'}</strong>
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#888' }}>
                    {r.mentee?.email}
                  </span>
                  {r.message && <p style={{ margin: '4px 0', fontSize: '13px', color: '#47585a' }}>{r.message}</p>}
                  <span style={{ fontSize: '12px', fontWeight: '700', color: statusColor[r.status] }}>
                    ● {r.status}
                  </span>
                  {r.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button className="primary-btn"
                        style={{ flex: 1, marginTop: 0, padding: '6px' }}
                        onClick={() => handleStatusUpdate(r._id, 'Accepted')}>
                        Accept
                      </button>
                      <button className="primary-btn"
                        style={{ flex: 1, marginTop: 0, padding: '6px', background: '#ef4444' }}
                        onClick={() => handleStatusUpdate(r._id, 'Rejected')}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Mentor_front;
