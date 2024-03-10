import axios, { AxiosInstance } from "axios" 
import { jwtDecode } from "jwt-decode"
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import dayjs from "dayjs"

const baseURL = "http://localhost:8000/api"

interface AuthTokens {
    access: string;
    refresh: string;
}

interface User {
    exp: number;
}

const useAxios = (): AxiosInstance => {
    const { authTokens, setUser, setAuthTokens} = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers: {Authorization: `Bearer ${authTokens?.access}`},
    });

    axiosInstance.interceptors.request.use(async request => {
        if (!authTokens) return request;

        const user = jwtDecode(authTokens.access);
        const isExpired: boolean = user.exp ? dayjs.unix(user.exp).diff(dayjs()) < 1 : false;

        if (!isExpired) return request;

        try {
            const response = await axios.post<AuthTokens>(`${baseURL}/token/refresh/`, {
                refresh: authTokens.refresh
            });
    
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
    
            request.headers.Authorization = `Bearer ${response.data.access}`;

        } catch (error) {
            console.error('Error refreshing token: ', error);
        }

        return request
    })

    return axiosInstance;
}

export default useAxios;