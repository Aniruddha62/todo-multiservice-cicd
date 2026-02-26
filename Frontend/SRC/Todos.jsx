import React, { useEffect, useState } from 'react';
import { todoApi, userApi } from '../services/api';

const PRIORITY_COLOR = { HIGH: '#fde8e8', MEDIUM: '#fef9c3', LOW: '#dcfce7' };
const EMPTY = { title: '', description: '', priority: 'MEDIUM', userId: '' };

export default function Todos() {
  const [todos, setTodos]       = useState([]);
  const [users, setUsers]       = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [filter, setFilter]     = useState('ALL');

  const load = () => {
    todoApi.getAll().then(r => setTodos(r.data)).catch(() => {});
    userApi.getAll().then(r => setUsers(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, userId: form.userId ? Number(form.userId) : null };
    try {
      editId ? await todoApi.update(editId, payload) : await todoApi.create(payload);
      setShowForm(false); setForm(EMPTY); setEditId(null); load();
    } catch { alert('Error saving todo'); }
  };

  const handleEdit = (t) => {
    setForm({ title: t.title, description: t.description || '', priority: t.priority, userId: t.userId || '' });
    setEditId(t.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this todo?')) { await todoApi.delete(id); load(); }
  };

  const getUserName = (uid) => users.find(u => u.id === uid)?.name || '—';

  const filtered = todos.filter(t =>
    filter === 'ALL' ? true : filter === 'DONE' ? t.completed : !t.completed
  );

  const btn = (c) => ({ background: c, color: '#fff', border: 'none',
    padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' });
  const inp = { padding: '0.55rem 0.75rem', border: '1px solid #e2e8f0',
    borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box', marginBottom: '0.9rem' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#1e293b', margin: 0 }}>Todos</h1>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0', fontSize: '0.88rem' }}>{filtered.length} tasks</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select style={{ padding: '0.45rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="DONE">Completed</option>
          </select>
          <button style={btn('#0ea5e9')} onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}>
            + Add Todo
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(t => (
          <div key={t.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '1rem',
            opacity: t.completed ? 0.6 : 1 }}>
            <input type="checkbox" checked={t.completed} style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              onChange={() => { todoApi.toggle(t.id).then(load); }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#1e293b',
                textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</div>
              {t.description && <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{t.description}</div>}
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                User: {getUserName(t.userId)}
              </div>
            </div>
            <span style={{ background: PRIORITY_COLOR[t.priority], padding: '2px 10px',
              borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', color: '#334155' }}>
              {t.priority}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button style={btn('#6366f1')} onClick={() => handleEdit(t)}>Edit</button>
              <button style={btn('#e11d48')} onClick={() => handleDelete(t.id)}>Del</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>No todos found</div>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '420px' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'New'} Todo</h2>
            <form onSubmit={submit}>
              <label style={{ color: '#475569', fontSize: '0.85rem' }}>Title *</label>
              <input style={inp} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <label style={{ color: '#475569', fontSize: '0.85rem' }}>Description</label>
              <input style={inp} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <label style={{ color: '#475569', fontSize: '0.85rem' }}>Priority</label>
              <select style={inp} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <label style={{ color: '#475569', fontSize: '0.85rem' }}>Assign to User</label>
              <select style={inp} value={form.userId} onChange={e => setForm({...form, userId: e.target.value})}>
                <option value="">No user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
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
