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
      setError(null);
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
      // Silently fail for referral tree
      console.error('Failed to fetch referral tree:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setDashboard(null);
    setReferralTree([]);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('running')) {
      return 'status-badge active';
    }
    if (statusLower.includes('complete') || statusLower.includes('finished')) {
      return 'status-badge completed';
    }
    return 'status-badge pending';
  };

  if (!token) {
    return (
      <div className="app-container">
        <h1>💼 Investment Dashboard</h1>
        <form onSubmit={handleLogin} className="card form-card">
          <label>
            📧 Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <label>
            🔒 Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="hint">
          💡 Don't have an account? Register via the API endpoint or contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>💼 Investment Dashboard</h1>
          {dashboard && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Welcome back, <strong>{dashboard.user.name}</strong> • Balance: ${dashboard.user.walletBalance.toFixed(2)}
            </p>
          )}
        </div>
        <button onClick={handleLogout}>🚪 Logout</button>
      </header>

      {loading && !dashboard && (
        <div className="loading">Loading your dashboard</div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {dashboard && (
        <>
          <section className="grid">
            <div className="card">
              <h2>💰 Total Investments</h2>
              <p className="number">${dashboard.totals.totalInvestments.toFixed(2)}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                All-time investment total
              </p>
            </div>
            <div className="card">
              <h2>📈 Total ROI</h2>
              <p className="number">${dashboard.totals.totalRoi.toFixed(2)}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Cumulative returns
              </p>
            </div>
            <div className="card">
              <h2>🎯 Level Income</h2>
              <p className="number">${dashboard.totals.totalLevelIncome.toFixed(2)}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Referral earnings
              </p>
            </div>
            <div className="card">
              <h2>✨ Today&apos;s ROI</h2>
              <p className="number">${dashboard.totals.todayRoi.toFixed(2)}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Daily earnings
              </p>
            </div>
          </section>

          <section className="card" style={{ marginBottom: '2rem' }}>
            <h2>📊 Your Investments</h2>
            {dashboard.investments.length === 0 ? (
              <div className="empty-state">
                <p>No investments yet. Start investing to see your portfolio here!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.investments.map((inv) => (
                      <tr key={inv._id}>
                        <td>
                          <strong>{inv.plan}</strong>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary-light)' }}>
                            ${inv.amount.toFixed(2)}
                          </strong>
                        </td>
                        <td>{new Date(inv.startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</td>
                        <td>{new Date(inv.endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</td>
                        <td>
                          <span className={getStatusBadgeClass(inv.status)}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card" style={{ marginBottom: '2rem' }}>
            <h2>💵 Level Income History</h2>
            {dashboard.levelIncome.length === 0 ? (
              <div className="empty-state">
                <p>No level income recorded yet. Refer users to start earning!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
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
                        <td>
                          <span style={{ 
                            display: 'inline-block',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--gradient-1)',
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: '32px',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}>
                            {li.level}
                          </span>
                        </td>
                        <td>
                          <strong>{li.fromUser}</strong>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--success)' }}>
                            +${li.amount.toFixed(2)}
                          </strong>
                        </td>
                        <td>{new Date(li.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card">
            <h2>🌳 Referral Tree</h2>
            {referralTree.length === 0 ? (
              <div className="empty-state">
                <p>No referrals yet. Share your referral code to grow your network!</p>
              </div>
            ) : (
              referralTree.map((level) => (
                <div key={level.level} className="referral-level">
                  <h3>
                    Level {level.level} 
                    <span style={{ 
                      marginLeft: '1rem', 
                      fontSize: '0.875rem', 
                      color: 'var(--text-muted)',
                      fontWeight: 'normal'
                    }}>
                      ({level.users.length} {level.users.length === 1 ? 'user' : 'users'})
                    </span>
                  </h3>
                  <ul>
                    {level.users.map((u) => (
                      <li key={u._id}>
                        <strong>{u.name}</strong>
                        <span style={{ 
                          display: 'block', 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)',
                          marginTop: '0.25rem'
                        }}>
                          {u.email}
                        </span>
                        <span style={{ 
                          display: 'inline-block',
                          marginTop: '0.5rem',
                          padding: '0.25rem 0.75rem',
                          background: 'var(--bg-primary)',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: 'var(--primary-light)',
                          fontFamily: 'monospace'
                        }}>
                          Code: {u.referralCode}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
};
