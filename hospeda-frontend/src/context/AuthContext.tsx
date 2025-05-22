// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    token: string | null,
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined); //Contexto de autenticacion inicializado>

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);


    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const isAuthenticated = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        else {
            setToken(null);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => useContext(AuthContext);
