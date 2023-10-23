import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token:string | null; authenticated: boolean | null};
    onLogin?: ( userName: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'http://159.146.90.69:5000/identity/Auth';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('stoed',token);

            if(token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token:token,
                    authenticated: true
                });
            }
        };
        loadToken();
    }, []);

    const login = async (userName: string, password: string) => {
        try{
            const result = await axios.post(`${API_URL}/Login`, { userName, password});
            
            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg};
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        login: login,
        logout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}