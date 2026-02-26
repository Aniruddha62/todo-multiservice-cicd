import React, { useEffect, useState } from 'react';
import { todoApi, userApi } from '../services/api';

const Card = ({ label, value, color, icon }) => (
  <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', flex: 1,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '4px solid ' + color }}>
    <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{icon}</div>
    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{label}</div>
    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{value}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    todoApi.stats().then(r => setStats(r.data)).catch(() => {});
    userApi.getAll().then(r => setUserCount(r.data.length)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ color: '#1e293b', margin: '0 0 0.25rem' }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Multiservice Todo Manager · Todo Service :8081 · User Service :8082
      </p>
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <Card label="Total Todos"     value={stats.total     ?? '—'} color="#0ea5e9" icon="📋" />
        <Card label="Completed"       value={stats.completed ?? '—'} color="#22c55e" icon="✅" />
        <Card label="Pending"         value={stats.pending   ?? '—'} color="#f59e0b" icon="⏳" />
        <Card label="Registered Users"value={userCount}              color="#a78bfa" icon="👤" />
      </div>

      <div style={{ marginTop: '2rem', background: '#fff', borderRadius: '10px',
        padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Services</h3>
        {[
          { name: 'Todo Service',  port: ':8081', endpoint: '/api/todos' },
          { name: 'User Service',  port: ':8082', endpoint: '/api/users' },
          { name: 'PostgreSQL (todo-db)',  port: ':5432', endpoint: '' },
          { name: 'PostgreSQL (user-db)',  port: ':5433', endpoint: '' },
          { name: 'Prometheus',    port: ':9090', endpoint: '' },
          { name: 'Grafana',       port: ':3001', endpoint: '' },
        ].map(s => (
          <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between',
            padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: '#334155' }}>{s.name}
              <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}> {s.endpoint}</span>
            </span>
            <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.85rem' }}>● {s.port}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
