import axios from 'axios';

export const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_URL,
  headers: { "Content-Type": "application/json" }
});

export const timerApi = axios.create({
  baseURL: process.env.REACT_APP_TIMER_URL,
  headers: { "Content-Type": "application/json" }
});

export const taskApi = axios.create({
  baseURL: process.env.REACT_APP_TASK_URL,
  headers: { "Content-Type": "application/json" }
});
