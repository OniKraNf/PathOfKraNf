    'use client'

    import { createContext, useState, useEffect, ReactNode } from "react";
    import { useRouter } from 'next/navigation'
    import { jwtDecode } from 'jwt-decode'

    interface AuthTokens {
        access: string;
        refresh: string;
    }

    interface User {
        user_id: number,
        exp: number;
        username: string;
        groups: string[];
    }

    interface AuthContextType {
        user: User | null;
        setUser: React.Dispatch<React.SetStateAction<User | null>>;
        authTokens: AuthTokens | null;
        setAuthTokens: React.Dispatch<React.SetStateAction<AuthTokens | null>>;
        registerUser: (email: string, username: string, password: string, password2: string) => Promise<void>;
        loginUser: (email: string, password: string) => Promise<void>;
        logoutUser: () => void;
    }

    interface DecodedToken {
        is_active: boolean
    }

    const AuthContext = createContext<AuthContextType>({
        user: null,
        setUser: () => null,
        authTokens: null,
        setAuthTokens: () => null,
        registerUser: async () => {},
        loginUser: async () => {},
        logoutUser: () => {}
    })

    interface UserProfile {
        id: number;
        user: number;
        full_name: string;
        bio: string;
        image: string;
        verified: boolean;
    }

    export default AuthContext;

    export const AuthProvider = ({ children } : { children: ReactNode }) => {

        const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
        const router = useRouter()

        const loginUser = async (email: string, password: string) => {
            try {
                const response = await fetch("http://0.0.0.0:8000/api/token/", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email, password
                    })
                });

                const data = await response.json();
                console.log({'Data': data})

                if (response.ok) {

                    const decoded : DecodedToken = jwtDecode(data.access)

                    if (decoded.is_active) {
                        setAuthTokens(data);
                        setUser(jwtDecode(data.access));
                        window.localStorage.setItem("authTokens", JSON.stringify(data));
                        router.push('/');
                    } else {
                        throw new Error('Your account is not activated');
                    }
                } else {
                    throw new Error(`Login failed with status ${response.status}`);
                }

            } catch (error) {
                console.error('Login error: ', error);
                alert("Something went wrong during login.");
            }

        }

        const registerUser = async (email: string, username: string, password: string, password2: string) => {
            const response = await fetch('http://0.0.0.0:8000/api/register/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, username, password, password2
                })
            })

            console.log('Response: ', response)

            if (response.ok) {
                router.push('/login')
            } else {
                throw new Error(`Registration failed with status ${response.status}`);
            }
        }

        const logoutUser = async () => {
            router.push('/login');
            setAuthTokens(null);
            setUser(null);
            window.localStorage.removeItem('authTokens');
        }


        useEffect(() => {
            if (typeof window !== 'undefined') {
                const tokens = localStorage.getItem('authTokens');
                if (tokens) {
                    setAuthTokens(JSON.parse(tokens));
                    setUser(jwtDecode(tokens));
                }
            }
        }, []);

        return (
            <AuthContext.Provider value={{ user, setUser, authTokens, setAuthTokens, registerUser, loginUser, logoutUser }}>
                {/* {!loading && children} */}
                {children}
            </AuthContext.Provider> 
        )
    }