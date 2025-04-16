import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Infinity } from "lucide-react";

// Define user types
export interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  plan: string;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setCredits: (credits: number) => void;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  plan: string;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Function to load user data
  const loadUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await apiRequest("GET", "/api/user");
      setUser(userData);
    } catch (err) {
      // Check if the error is "User not found"
      if (err instanceof Error && err.message.includes("User not found")) {
        console.error("User not found in session, logging out...");
        // Clear the session by calling logout
        try {
          await apiRequest("POST", "/api/auth/logout");
          // Invalidate queries
          queryClient.invalidateQueries();
          
          toast({
            title: "Session expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
        } catch (logoutErr) {
          console.error("Error during automatic logout:", logoutErr);
        }
      }
      
      // Not setting error here as this is expected when not logged in
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiRequest("POST", "/api/auth/login", { username, password });
      await loadUser();
      
      // Invalidate queries to refetch data with new user
      queryClient.invalidateQueries({ queryKey: ["/api/keys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiRequest("POST", "/api/auth/signup", data);
      // Automatically log in after signup
      await login(data.username, data.password);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      
      // Invalidate queries
      queryClient.invalidateQueries();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update credits (used when making API calls)
  const setCredits = (credits: number) => {
    if (user) {
      setUser({ ...user, credits });
    }
  };

  const renderCredits = () => {
    if (user?.plan === "pro") {
      return <Infinity className="w-4 h-4 text-indigo-300" />;
    } else {
      return (
        <>
          <span className="font-medium">{user?.credits || 0}</span>
          <span className="text-xs text-indigo-200">credits</span>
        </>
      );
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        loadUser,
        setCredits,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Create a hook for using the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
} 