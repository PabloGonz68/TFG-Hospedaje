// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    nombre: string;
    apellidos: string;
    email: string;
    fotoPerfil: string;
}

type AuthContextType = {
    token: string | null,
    user: User | null,
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined); //Contexto de autenticacion inicializado>

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    })


    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        else {
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => useContext(AuthContext);
