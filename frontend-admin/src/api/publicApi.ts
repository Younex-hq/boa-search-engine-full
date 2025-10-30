// for forgot password notification (no token)

import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_LOGIN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
