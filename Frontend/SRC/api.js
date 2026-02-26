import axios from 'axios';

const TODO_API = axios.create({ baseURL: process.env.REACT_APP_TODO_API || 'http://localhost:8081' });
const USER_API = axios.create({ baseURL: process.env.REACT_APP_USER_API || 'http://localhost:8082' });

export const todoApi = {
  getAll:     ()        => TODO_API.get('/api/todos'),
  getById:    (id)      => TODO_API.get('/api/todos/' + id),
  getByUser:  (uid)     => TODO_API.get('/api/todos/user/' + uid),
  create:     (data)    => TODO_API.post('/api/todos', data),
  update:     (id, d)   => TODO_API.put('/api/todos/' + id, d),
  toggle:     (id)      => TODO_API.patch('/api/todos/' + id + '/toggle'),
  delete:     (id)      => TODO_API.delete('/api/todos/' + id),
  stats:      ()        => TODO_API.get('/api/todos/stats'),
};

export const userApi = {
  getAll:   ()       => USER_API.get('/api/users'),
  getById:  (id)     => USER_API.get('/api/users/' + id),
  create:   (data)   => USER_API.post('/api/users', data),
  update:   (id, d)  => USER_API.put('/api/users/' + id, d),
  delete:   (id)     => USER_API.delete('/api/users/' + id),
};
