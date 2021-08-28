import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8999",
});

export default instance;
