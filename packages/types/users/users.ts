import z from 'zod';

export type Users = {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    username: string;
    role: 'user' | 'admin' | 'agent' | 'merchant';
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

export const CreateUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
});

export type UserDTO = z.infer<typeof CreateUserSchema>;
