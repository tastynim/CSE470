import React, { useState } from 'react';
import './Payment_front.css';

function Payment_front() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank');
  const [resp, setResp] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/payments/${method.toLowerCase()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: Number(amount) })
      });
      const data = await res.json();
      setResp({ status: res.status, data });
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

      <main className="page container">
        <div className="card">
          <h2 className="card-title">Proceed to Payment</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="label">Order ID</label>
            <input className="input" value={orderId} onChange={e => setOrderId(e.target.value)} required />

            <label className="label">Amount</label>
            <input type="number" className="input" value={amount} onChange={e => setAmount(e.target.value)} required />

            <label className="label">Payment Method</label>
            <select className="input" value={method} onChange={e => setMethod(e.target.value)}>
              <option>Bank</option>
              <option>Bkash</option>
              <option>Rocket</option>
            </select>

            <button className="primary-btn" type="submit">Proceed to Payment</button>
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

export default Payment_front;
