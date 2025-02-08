import { 
    useQuery, 
    useMutation, 
    useQueryClient,
    UseQueryResult
} from '@tanstack/react-query';

import { apiClient, authAxios } from '@/lib/api/client';
import { usePathname } from 'next/navigation';

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface SignupCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: AuthUser;
    access_token: string;
    message: string;
}

// Add auth token to all requests
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const pathname = window.location.pathname;
            if (!pathname.startsWith('/auth/')) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export const useCurrentUser = (): UseQueryResult<AuthUser | null, Error> => {
    const pathname = usePathname();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const isAuthPage = pathname?.startsWith('/auth/');

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            try {
                // Don't fetch user data on auth pages or if no token exists
                if (isAuthPage || !token) {
                    return null;
                }
                const { data } = await authAxios.get<AuthUser>('/auth/me');
                return data;
            } catch {
                return null;
            }
        },
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
        retry: false, // Don't retry failed requests
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        enabled: !isAuthPage && !!token // Only run query if not on auth page and token exists
    });
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, SignupCredentials>({
        mutationFn: (credentials: SignupCredentials) => 
            apiClient.post<AuthResponse>('/auth/signup', credentials)
                .then(response => response.data),
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.setQueryData(['currentUser'], data.user);
        }
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, LoginCredentials>({
        mutationFn: (credentials: LoginCredentials) => 
            apiClient.post<AuthResponse>('/auth/login', credentials)
                .then(response => response.data),
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.setQueryData(['currentUser'], data.user);
        }
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: () => authAxios.post('/auth/logout').then(() => undefined),
        onSuccess: () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            queryClient.setQueryData(['currentUser'], null);
            queryClient.clear();
        }
    });
};

export const useRequestPasswordReset = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const { data } = await authAxios.post(
                `/auth/reset-password-request`,
                { email }
            );
            return data;
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async ({ 
            token, 
            password 
        }: { 
            token: string; 
            password: string;
        }) => {
            const { data } = await authAxios.post(
                `/auth/reset-password`,
                { token, password }
            );
            return data;
        },
    });
};

// Update password mutation
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: async ({ 
            currentPassword, 
            newPassword 
        }: { 
            currentPassword: string; 
            newPassword: string;
        }) => {
            const { data } = await authAxios.put(
                `/auth/update-password`,
                { currentPassword, newPassword }
            );
            return data;
        },
    });
};
