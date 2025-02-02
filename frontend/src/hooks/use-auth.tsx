import { 
    useQuery, 
    useMutation, 
    useQueryClient 
} from '@tanstack/react-query';


import { apiClient, authAxios } from '@/lib/api/client';

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
    access_token?: string;
    token?: string;
}




authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { data } = await authAxios.get('/auth/me');
            return data as AuthUser;
        },
        // Only run if we have a token
        enabled: !!localStorage.getItem('access_token'),
        retry: false,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
};


export const useSignup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (credentials: SignupCredentials) => {
            const { data } = await authAxios.post(
                `/auth/signup`,
                credentials
            );
            return data as AuthResponse;
        },
        onSuccess: (data) => {
            console.log(data);
            const token = data.access_token || data?.token;
            // Store the token
            localStorage.setItem('access_token', token || '');
            // Update the current user in the cache
            queryClient.setQueryData(['currentUser'], data.user);
        },
    });
};


export const useLogin = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data } = await authAxios.post(
                `/auth/login`,
                credentials
            );
            return data as AuthResponse;
        },
        onSuccess: (data) => {
            console.log(data);
            const token = data.access_token || data?.token;
            // Store the token
            localStorage.setItem('access_token', token || '');
            localStorage.setItem('user', JSON.stringify(data.user));
            // Update the current user in the cache
            queryClient.setQueryData(['currentUser'], data.user);
        },
    });
};


export const useLogout = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            // Optional: call logout endpoint if you have one
            try {
                await authAxios.post(`/auth/logout`);
            } catch (error) {
                // Continue with local logout even if server logout fails
                console.error('Server logout failed:', error);
            }
            return null;
        },
        onSuccess: () => {
            // Clear token
            localStorage.removeItem('access_token');
            // Clear user from cache
            queryClient.setQueryData(['currentUser'], null);
            // Remove all queries from cache
            queryClient.clear();
        },
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

      
