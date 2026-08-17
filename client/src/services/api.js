import axios from "axios";

const API = axios.create({
  baseURL: "https://civilintel.onrender.com/api",
});

export default API;