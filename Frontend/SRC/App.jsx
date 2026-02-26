import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Todos from './pages/Todos';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';

const C = {
  nav: { background: '#1e293b', display: 'flex', alignItems: 'center', padding: '0 2rem', height: '56px', gap: '2rem' },
  brand: { color: '#38bdf8', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none' },
  link: (a) => ({ color: a ? '#fff' : '#94a3b8', textDecoration: 'none', fontWeight: a ? '600' : '400',
    padding: '4px 0', borderBottom: a ? '2px solid #38bdf8' : '2px solid transparent' }),
  page: { background: '#f8fafc', minHeight: 'calc(100vh - 56px)', padding: '2rem', fontFamily: 'system-ui,sans-serif' },
};

export default function App() {
  return (
    <Router>
      <nav style={C.nav}>
        <NavLink to="/" style={C.brand}>✅ TodoManager</NavLink>
        {[['/', 'Dashboard'], ['/todos', 'Todos'], ['/users', 'Users']].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => C.link(isActive)}>{label}</NavLink>
        ))}
        <span style={{ marginLeft: 'auto', color: '#475569', fontSize: '0.8rem' }}>
          2 microservices · Jenkins CI/CD · Terraform AWS
        </span>
      </nav>
      <div style={C.page}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}
