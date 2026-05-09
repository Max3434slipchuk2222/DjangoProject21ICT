import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";
import APP_ENV from "../env";
import type { RootState } from "../store";
import { updateAccessToken, logout } from "../store/slices/authSlice";

const rawBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${APP_ENV.API_BASE_URL}/api/${endpoint}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    });

export const createBaseQuery = (endpoint: string): BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> => {
    const baseQuery = rawBaseQuery(endpoint);

    return async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            const state = api.getState() as RootState;
            const refreshToken = state.auth.refreshToken;

            if (refreshToken) {
                const refreshResult = await fetchBaseQuery({
                    baseUrl: `${APP_ENV.API_BASE_URL}/api/`,
                })(
                    {
                        url: 'auth/token/refresh/',
                        method: 'POST',
                        body: { refresh: refreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    const { access } = refreshResult.data as { access: string };
                    api.dispatch(updateAccessToken(access));
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logout());
                }
            } else {
                api.dispatch(logout());
            }
        }

        return result;
    };
};