import axios, { type AxiosRequestConfig } from "axios";

import { baseURL } from "./config";

export const api = axios.create({
    baseURL,
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const requestUrl = error.config?.url

        if (requestUrl?.includes("/login")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const get = <T>({
    url,
    params,
    config,
}: {
    url: string;
    params?: AxiosRequestConfig["params"];
    config?: AxiosRequestConfig;
}): Promise<T> =>

    api.get(url, {
        // url,
        params,
        ...config,
    });

export const post = <T>({
    url,
    data,
    config
}: {
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
}): Promise<T> => api.post(url, data, config)

export const update = ({
    url,
    data,
    config
}: {
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
}) => api.put(url, data, config)

export const remove = ({ url }: { url: string }) => api.delete(url)