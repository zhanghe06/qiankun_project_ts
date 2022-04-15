import axios from "axios";

export const http = axios.create({
    baseURL: "http://127.0.0.1:30975/",
    // baseURL: "/",
    headers: {
        "Content-type": "application/json"
    }
});

// 请求拦截
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || "123456";
        if (token) {
            config.headers = {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": 'Bearer ' + token,
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截
http.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        return Promise.reject(err);
    }
);
