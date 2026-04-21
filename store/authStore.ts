import {create} from 'zustand';

type User= {
    id: string;
    role: string;
    email: string;
    
};

type AuthState = {
    user: User | null;
    token: string | null;
    hydrated: boolean;
    loadAuth: () => void;
    setAuth: (user: User, token: string) => void;
    logOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    hydrated: false,
    setAuth: (user, token) => {
        localStorage.setItem("token", token) ;
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, token, hydrated: true });
    },
    loadAuth:()=> {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        set({ token, user: user ? JSON.parse(user) : null, hydrated: true });},
    logOut: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null, hydrated: true });
    }
}));