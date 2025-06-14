import axios from 'axios';

// const REACT_APP_TIMER_URL = "http://localhost:4001"
// const REACT_APP_TASK_URL = "http://localhost:4002"


export const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" }
});

export const timerApi = axios.create({
  baseURL: process.env.REACT_APP_TIMER_URL || "http://localhost:4001",
  headers: { "Content-Type": "application/json" }
});

export const taskApi = axios.create({
  baseURL: process.env.REACT_APP_TASK_URL || "http://localhost:4002",
  headers: { "Content-Type": "application/json" }
});
