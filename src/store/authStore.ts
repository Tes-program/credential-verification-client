// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the user roles
export type UserRole = 'institution' | 'student';

export const isInstitution = (role: UserRole): role is "institution" => role === "institution";
export const isStudent = (role: UserRole): role is "student" => role === "student";

// Define the user type
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  institution?: string;
};

// Define the authentication state
type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};

// Create the authentication store with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Login function to set user and token
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      // Logout function to clear user and token
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      // Update user information
      updateUser: (updatedUser) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updatedUser } : null 
      })),
    }),
    {
      name: 'auth-storage', // storage name
    }
  )
);

export default useAuthStore;