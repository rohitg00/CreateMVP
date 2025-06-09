import { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// --- Define User Types ---

// Basic user profile from our database
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// The main user type that includes profile data
export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}

// --- Define Context Type ---

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  fetchUser: () => Promise<User | null>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
}

// --- Context Setup ---

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const user: User = {
    id: 1,
    username: 'self-hosted-user',
    email: 'user@localhost',
    profile: {
      id: 1,
      username: 'self-hosted-user',
      email: 'user@localhost',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  const error = null;
  const isLoading = false;
  
  const fetchUser = async () => {
    console.log("Fetch user not needed in self-hosted version");
    return user;
  };

  // Log out the user
  const logout = async () => {
    console.log("Logout not needed in self-hosted version");
    window.location.href = "/";
  };

  // Update user profile
  const updateUser = async (data: Partial<UserProfile>) => {
    console.log("Profile update not needed in self-hosted version");
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const value = {
    user,
    isLoading,
    error,
    logout,
    fetchUser,
    updateUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
