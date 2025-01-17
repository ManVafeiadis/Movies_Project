// src/types/index.ts

export interface Movie {
    id: number;
    title: string;
    director: string;
    category: string;
    description: string;
    release_date: string;
    reviews: Review[];
}
  
export interface Review {
    id: number;
    created_at: string;
    updated_at: string;
    review_author: string;
    review: string | null;
    rating: number;
}
  
export interface User {
    username: string;
    isAdmin: boolean;
    token: string;
}
  
export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string, password2: string) => Promise<void>;
    tokenExpiry: Date | null;
}

export interface JwtPayload {
    username: string;
    is_staff: boolean;
    exp: number;
}
  