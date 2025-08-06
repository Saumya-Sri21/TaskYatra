export const BASE_URL = import.meta.env.VITE_API_URL;

export const APIPATH = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/profile",
  },
  TASKS: {
    ROOT: "/tasks",
    DASHBOARD: "/tasks/dashboard-data",
    USER_DASHBOARD: "/tasks/user-dashboard-data",
    BY_ID: (id) => `/tasks/${id}`,
    STATUS: (id) => `/tasks/${id}/status`,
    TODO: (id) => `/tasks/${id}/todo`,
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id) => `/users/${id}`,
  },
};
