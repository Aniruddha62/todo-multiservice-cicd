import React, { useEffect, useState } from 'react';
import { userApi } from '../services/api';

const EMPTY = { name: '', email: '' };

export default function Users() {
  const [users, setUsers]       = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);

  const load = () => userApi.getAll().then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      editId ? await userApi.update(editId, form) : await userApi.create(form);
      setShowForm(false); setForm(EMPTY); setEditId(null); load();
    } catch { alert('Error saving user (email may already exist)'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete user?')) { await userApi.delete(id); load(); }
  };

  const btn = (c) => ({ background: c, color: '#fff', border: 'none',
    padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' });
  const inp = { padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0',
    borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', marginBottom: '0.9rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#1e293b', margin: 0 }}>Users</h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{users.length} registered</p>
        </div>
        <button style={btn('#0ea5e9')} onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}>
          + Add User
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1rem' }}>
        {users.map(u => (
          <div key={u.id} style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
            <div style={{ fontWeight: '700', color: '#1e293b' }}>{u.name}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>{u.email}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button style={btn('#6366f1')} onClick={() => {
                setForm({ name: u.name, email: u.email }); setEditId(u.id); setShowForm(true);
              }}>Edit</button>
              <button style={btn('#e11d48')} onClick={() => handleDelete(u.id)}>Delete</button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ color: '#94a3b8', padding: '2rem' }}>No users yet — add one!</div>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '380px' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'New'} User</h2>
            <form onSubmit={submit}>
              <label style={{ color: '#475569', fontSize: '0.85rem' }}>Name *</label>
              <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <label style={{ color: '#475569', fontSize: '0.85rem' }}>Email *</label>
              <input style={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" style={btn('#0ea5e9')}>Save</button>
                <button type="button" style={btn('#94a3b8')} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
