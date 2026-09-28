import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const useApi = () => {
    const {
        accessToken,
        setAccessToken,
        setUser,
    } = useContext(AuthContext);

    const api = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
    });

    api.interceptors.request.use(
        (config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,

        async (error) => {
            const originalRequest = error.config;

            if (
                error.response?.status === 401 &&
                !originalRequest?._retry
            ) {
                originalRequest._retry = true;

                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                        {},
                        {
                            withCredentials: true,
                        }
                    );

                    const newAccessToken = res.data.accessToken;

                    setAccessToken(newAccessToken);

                    setUser(res.data.user);

                    // Retry the original request
                    originalRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    return api(originalRequest);

                } catch (refreshError) {
                    setAccessToken(null);
                    setUser(null);

                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
};

export default useApi;