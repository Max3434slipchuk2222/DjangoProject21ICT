import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../types/auth/IUser';

interface AuthState {
    user: IUser | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}
function safeParseJSON<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw || raw === 'undefined' || raw === 'null') return null;
        return JSON.parse(raw) as T;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
}

const storedToken = localStorage.getItem('token');
const safeToken = storedToken && storedToken !== 'undefined' ? storedToken : null;

const initialState: AuthState = {
    user: safeParseJSON<IUser>('user'),
    token: safeToken,
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!safeToken,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ access: string; refresh: string }>
        ) => {
            const { access, refresh } = action.payload;
            state.token = access;
            state.refreshToken = refresh;
            state.isAuthenticated = true;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
        },

        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, setUser, updateAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;