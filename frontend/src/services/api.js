import axios from 'axios';

export const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_URL || "http://localhost:4000/api/auth",
  headers: { "Content-Type": "application/json" }
});

export const timerApi = axios.create({
  baseURL: process.env.REACT_APP_TIMER_URL || "http://localhost:4001/api",
  headers: { "Content-Type": "application/json" }
});

export const taskApi = axios.create({
  baseURL: process.env.REACT_APP_TASK_URL || "http://localhost:4002/api",
  headers: { "Content-Type": "application/json" }
});
