import React, { useState, useEffect } from 'react';
import './Payment_front.css';

function Admin_approve_front() {
  const [tab, setTab] = useState('users');   // users | products | certifications
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [certs, setCerts] = useState([]);
  const [resp, setResp] = useState(null);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      const [uRes, pRes, cRes] = await Promise.all([
        fetch('/api/admin-approve/users/pending',          { headers: authHeader }),
        fetch('/api/admin-approve/products/pending',       { headers: authHeader }),
        fetch('/api/admin-approve/certifications/pending', { headers: authHeader }),
      ]);
      const [uData, pData, cData] = await Promise.all([uRes.json(), pRes.json(), cRes.json()]);
      setUsers(Array.isArray(uData) ? uData : []);
      setProducts(Array.isArray(pData) ? pData : []);
      setCerts(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const action = async (url, method = 'PUT') => {
    try {
      const res = await fetch(url, { method, headers: authHeader });
      const data = await res.json();
      setResp({ status: res.status, data });
      if (res.ok) fetchAll();
    } catch (err) {
      setResp({ status: 0, data: { message: err.message } });
    }
  };

  const TABS = [
    ['users', `Users (${users.length})`],
    ['products', `Products (${products.length})`],
    ['certifications', `Certs (${certs.length})`],
  ];

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
        <div className="card" style={{ width: '100%', maxWidth: '700px' }}>
          <h2 className="card-title">Admin Approval Dashboard</h2>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {TABS.map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className="primary-btn"
                style={{ flex: 1, marginTop: 0, opacity: tab === key ? 1 : 0.5 }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Pending Users ── */}
          {tab === 'users' && (
            users.length === 0
              ? <p style={{ color: '#888', textAlign: 'center' }}>No pending users.</p>
              : users.map(u => (
                <div key={u._id} className="response" style={{ marginBottom: '12px' }}>
                  <strong>{u.name}</strong>
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#888' }}>{u.email}</span>
                  <span style={{ marginLeft: '8px', fontSize: '11px', background: '#e9f7ee',
                    borderRadius: '4px', padding: '2px 6px', color: '#2da84a' }}>{u.role}</span>
                  {u.location && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#47585a' }}>📍 {u.location}</p>}
                  {u.skills?.length > 0 && (
                    <p style={{ margin: '2px 0 8px', fontSize: '12px', color: '#47585a' }}>
                      Skills: {u.skills.join(', ')}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="primary-btn" style={{ flex: 1, marginTop: 0, padding: '7px' }}
                      onClick={() => action(`/api/admin-approve/users/${u._id}/approve`)}>
                      ✓ Approve
                    </button>
                    <button className="primary-btn"
                      style={{ flex: 1, marginTop: 0, padding: '7px', background: '#ef4444' }}
                      onClick={() => action(`/api/admin-approve/users/${u._id}/reject`)}>
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* ── Pending Products ── */}
          {tab === 'products' && (
            products.length === 0
              ? <p style={{ color: '#888', textAlign: 'center' }}>No pending products.</p>
              : products.map(p => (
                <div key={p._id} className="response" style={{ marginBottom: '12px' }}>
                  <strong>{p.name?.en || p.name}</strong>
                  <span style={{ marginLeft: '8px', fontSize: '11px', color: '#888' }}>{p.category}</span>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#47585a' }}>
                    Price: ৳{p.price}
                  </p>
                  {p.description?.en && (
                    <p style={{ margin: '4px 0 8px', fontSize: '12px', color: '#888' }}>
                      {p.description.en}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="primary-btn" style={{ flex: 1, marginTop: 0, padding: '7px' }}
                      onClick={() => action(`/api/admin-approve/products/${p._id}/approve`)}>
                      ✓ Approve
                    </button>
                    <button className="primary-btn"
                      style={{ flex: 1, marginTop: 0, padding: '7px', background: '#ef4444' }}
                      onClick={() => action(`/api/admin-approve/products/${p._id}/reject`)}>
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* ── Pending Certifications ── */}
          {tab === 'certifications' && (
            certs.length === 0
              ? <p style={{ color: '#888', textAlign: 'center' }}>No pending certifications.</p>
              : certs.map(c => (
                <div key={c._id} className="response" style={{ marginBottom: '12px' }}>
                  <strong>{c.skillName}</strong>
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#888' }}>
                    {c.user?.name} ({c.user?.email})
                  </span>
                  {c.issuedBy && (
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#47585a' }}>
                      Issued by: {c.issuedBy}
                    </p>
                  )}
                  <p style={{ margin: '4px 0 8px', fontSize: '12px', color: '#888' }}>
                    File: {c.certificationFile}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="primary-btn" style={{ flex: 1, marginTop: 0, padding: '7px' }}
                      onClick={() => action(`/api/admin-approve/certifications/${c._id}/approve`)}>
                      ✓ Approve
                    </button>
                    <button className="primary-btn"
                      style={{ flex: 1, marginTop: 0, padding: '7px', background: '#ef4444' }}
                      onClick={() => action(`/api/admin-approve/certifications/${c._id}/reject`)}>
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))
          )}

          {resp && (
            <div className="response" style={{ marginTop: '14px' }}>
              <h4>Response ({resp.status})</h4>
              <pre>{JSON.stringify(resp.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Admin_approve_front;
