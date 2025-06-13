import api from './api';

export function createSession(token, timerId, taskId) {
  return api.post("/api/sessions", { timerId, taskId }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function updateSession(token, id, status) {
  return api.patch(`/api/sessions/${id}`, { status }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function getSessionHistory(token, timerId) {
  return api.get("/api/sessions", {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { timerId }
  });
}
export function getStats(token) {
  return api.get("/api/sessions/stats", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
