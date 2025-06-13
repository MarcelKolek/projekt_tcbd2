import api from './api';

export function getTasks(token) {
  return api.get("/api/tasks", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function createTask(token, data) {
  return api.post("/api/tasks", data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function updateTask(token, id, data) {
  return api.put(`/api/tasks/${id}`, data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function getTags(token) {
  return api.get("/api/tags", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function createTag(token, name) {
  return api.post("/api/tags", { name }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function updateTag(token, id, name) {
  return api.put(`/api/tags/${id}`, { name }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
