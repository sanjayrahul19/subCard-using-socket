import axios from "axios";

const instance = axios.create({ baseURL: "http://104.248.15.243:4005/api/v1/" });

export default instance;