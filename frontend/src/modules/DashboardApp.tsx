import React, { useEffect, useState } from 'react';

type Investment = {
  _id: string;
  amount: number;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
};

type LevelIncome = {
  fromUser: string;
  level: number;
  amount: number;
  date: string;
};

type DashboardData = {
  user: {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
  };
  totals: {
    totalInvestments: number;
    totalRoi: number;
    totalLevelIncome: number;
    todayRoi: number;
  };
  investments: Investment[];
  levelIncome: LevelIncome[];
};

type ReferralLevel = {
  level: number;
  users: {
    _id: string;
    name: string;
    email: string;
    referralCode: string;
  }[];
};

const API_BASE = 'http://localhost:5000/api';

export const DashboardApp: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [referralTree, setReferralTree] = useState<ReferralLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored) {
      setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchDashboard();
    fetchReferralTree();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Login failed');
      }
      const body = await res.json();
      localStorage.setItem('authToken', body.token);
      setToken(body.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Failed to fetch dashboard');
      setDashboard(body);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralTree = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/referrals/tree`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Failed to fetch referral tree');
      setReferralTree(body);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch referral tree');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setDashboard(null);
    setReferralTree([]);
  };

  if (!token) {
    return (
      <div className="app-container">
        <h1>Investment Dashboard Login</h1>
        <form onSubmit={handleLogin} className="card form-card">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="hint">
          Use any user created via the `/api/auth/register` endpoint (e.g. using Postman).
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Investment Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {dashboard && (
        <>
          <section className="grid">
            <div className="card">
              <h2>Total Investments</h2>
              <p className="number">${dashboard.totals.totalInvestments.toFixed(2)}</p>
            </div>
            <div className="card">
              <h2>Total ROI</h2>
              <p className="number">${dashboard.totals.totalRoi.toFixed(2)}</p>
            </div>
            <div className="card">
              <h2>Level Income</h2>
              <p className="number">${dashboard.totals.totalLevelIncome.toFixed(2)}</p>
            </div>
            <div className="card">
              <h2>Today&apos;s ROI</h2>
              <p className="number">${dashboard.totals.todayRoi.toFixed(2)}</p>
            </div>
          </section>

          <section className="card">
            <h2>Investments</h2>
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.investments.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.plan}</td>
                    <td>${inv.amount.toFixed(2)}</td>
                    <td>{new Date(inv.startDate).toLocaleDateString()}</td>
                    <td>{new Date(inv.endDate).toLocaleDateString()}</td>
                    <td>{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <h2>Level Income</h2>
            <table>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>From User</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.levelIncome.map((li, idx) => (
                  <tr key={`${li.fromUser}-${li.date}-${idx}`}>
                    <td>{li.level}</td>
                    <td>{li.fromUser}</td>
                    <td>${li.amount.toFixed(2)}</td>
                    <td>{new Date(li.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <h2>Referral Tree</h2>
            {referralTree.length === 0 && <p>No referrals yet.</p>}
            {referralTree.map((level) => (
              <div key={level.level} className="referral-level">
                <h3>Level {level.level}</h3>
                <ul>
                  {level.users.map((u) => (
                    <li key={u._id}>
                      <strong>{u.name}</strong> ({u.email}) - Code: {u.referralCode}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

