import React, { useState, useEffect } from 'react';
import './Payment_front.css';

function Skill_upload_front() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({ skillName: '', issuedBy: '', issuedDate: '' });
  const [file, setFile] = useState(null);
  const [resp, setResp] = useState(null);

  const token = localStorage.getItem('token');

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/skill-uploads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setResp({ status: 0, data: { message: 'Please choose a file' } }); return; }
    try {
      const fd = new FormData();
      fd.append('certificationFile', file);
      fd.append('skillName', form.skillName);
      if (form.issuedBy) fd.append('issuedBy', form.issuedBy);
      if (form.issuedDate) fd.append('issuedDate', form.issuedDate);

      const res = await fetch('/api/skill-uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      setResp({ status: res.status, data });
      if (res.ok) {
        setForm({ skillName: '', issuedBy: '', issuedDate: '' });
        setFile(null);
        fetchCerts();
      }
    } catch (err) {
      setResp({ status: 0, data: { message: err.message } });
    }
  };

  const statusColor = { Pending: '#f59e0b', Approved: '#2da84a', Rejected: '#ef4444' };

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

        {/* ── Upload Form ── */}
        <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
          <h2 className="card-title">Upload Skill Certification</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="label">Skill Name</label>
            <input className="input" value={form.skillName}
              onChange={e => setForm({ ...form, skillName: e.target.value })} required />

            <label className="label">Issued By (optional)</label>
            <input className="input" value={form.issuedBy}
              onChange={e => setForm({ ...form, issuedBy: e.target.value })} />

            <label className="label">Issue Date (optional)</label>
            <input type="date" className="input" value={form.issuedDate}
              onChange={e => setForm({ ...form, issuedDate: e.target.value })} />

            <label className="label">Certificate File (JPG / PNG / PDF)</label>
            <input type="file" className="input" accept=".jpg,.jpeg,.png,.pdf"
              onChange={e => setFile(e.target.files[0])} required />

            <button className="primary-btn" type="submit">Upload Certificate</button>
          </form>

          {resp && (
            <div className="response">
              <h4>Response ({resp.status})</h4>
              <pre>{JSON.stringify(resp.data, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* ── My Certifications ── */}
        <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
          <h2 className="card-title">My Certifications</h2>
          {certs.length === 0
            ? <p style={{ color: '#888', textAlign: 'center' }}>No certifications uploaded yet.</p>
            : certs.map(c => (
              <div key={c._id} className="response" style={{ marginBottom: '10px' }}>
                <strong>{c.skillName}</strong>
                {c.issuedBy && <span style={{ marginLeft: '6px', fontSize: '13px', color: '#47585a' }}>
                  — {c.issuedBy}
                </span>}
                <br />
                <span style={{ fontSize: '12px', color: statusColor[c.status] || '#333',
                  fontWeight: '600' }}>
                  ● {c.status}
                </span>
                {c.issuedDate && (
                  <span style={{ marginLeft: '10px', fontSize: '12px', color: '#888' }}>
                    {new Date(c.issuedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))
          }
        </div>

      </main>
    </div>
  );
}

export default Skill_upload_front;
