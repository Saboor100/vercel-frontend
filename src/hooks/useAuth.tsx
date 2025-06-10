import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authService } from "@/services/firebaseClient";

interface User {
  id: string;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

interface AuthResult {
  success: boolean;
  data?: {
    user: User;
  };
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const result = (await authService.getCurrentUser()) as AuthResult;
        if (result.success && result.data?.user) {
          setUser(result.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
