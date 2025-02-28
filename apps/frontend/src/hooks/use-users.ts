import { 
    useQuery, 
    useMutation, 
    useQueryClient 
} from '@tanstack/react-query';

import { apiClient } from '@/lib/api/client';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface UpdateUserData {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

// Fetch all users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await apiClient.get('/users');
            return data as User[];
        },
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
};

// Fetch a single user by ID
export const useUser = (userId: string) => {
    console.log("Fetching user", userId)
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/users/${userId}`);
            return data as User;
        },
        enabled: !!userId, // Only run if userId is provided
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
};

// Create a new user
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: CreateUserData) => {
            const { data } = await apiClient.post('/users', userData);
            return data as User;
        },
        onSuccess: () => {
            // Invalidate and refetch the users query to update the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// Update an existing user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: UpdateUserData) => {
            const { data } = await apiClient.put(`/users/${userData.id}`, userData);
            return data as User;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch the users query to update the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            // Invalidate and refetch the specific user query
            queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
        },
    });
};

// Delete a user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            await apiClient.delete(`/users/${userId}`);
            return userId;
        },
        onSuccess: (userId) => {
            // Invalidate and refetch the users query to update the list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            // Remove the specific user query from the cache
            queryClient.removeQueries({ queryKey: ['user', userId] });
        },
    });
};