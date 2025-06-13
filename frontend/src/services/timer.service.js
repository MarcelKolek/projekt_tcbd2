import api from './api';

export function getTimers(token, params) {
  return api.get("/api/timers", {
    headers: { 'Authorization': `Bearer ${token}` },
    params: params
  });
}
export function createTimer(token, data) {
  return api.post("/api/timers", data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function updateTimer(token, id, data) {
  return api.put(`/api/timers/${id}`, data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
export function deleteTimer(token, id) {
  return api.delete(`/api/timers/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
