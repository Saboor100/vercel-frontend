import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/services/firebase";
import { toast } from "sonner";
import { authApi } from "@/services/apiClient";

export interface SubscriptionData {
  id: string | null;
  status: string;
  plan: string;
  cancel_at_period_end: boolean;
}

export interface AuthUser {
  id: string; // This is the Firebase UID
  email: string | null;
  displayName?: string | null;
  subscription?: SubscriptionData;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  firebaseUser: FirebaseUser | null;
  refreshToken: () => Promise<string | null>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails list - in a real app, this should come from a database with proper roles
const ADMIN_EMAILS = ["Flacroncv2025@gmail.com"]; // Add admin emails here

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  console.log("firebaseUser", firebaseUser);

  // Function to refresh token
  const refreshToken = async (): Promise<string | null> => {
    try {
      if (!firebaseUser) return null;

      // Force token refresh
      const token = await firebaseUser.getIdToken(true);
      console.log("Token refreshed successfully");

      // Update auth headers for future requests
      return token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  // Function to refresh user data from backend
  const refreshUserData = async (): Promise<void> => {
    if (!firebaseUser) return;

    try {
      console.log("Refreshing user data from backend...");

      // First refresh the token
      await refreshToken();

      // Then get fresh user data
      const response = await authApi.getUser();

      if (response.success && response.data) {
        // Check if user is admin
        const isAdmin = firebaseUser.email
          ? ADMIN_EMAILS.includes(firebaseUser.email)
          : false;

        // Store updated user data in state
        const updatedUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: response.data.displayName,
          subscription: response.data.subscription,
          isAdmin: isAdmin || response.data.role === "admin",
        };

        setUser(updatedUser);

        // Also store in localStorage for persistence across page refreshes
        localStorage.setItem("cached_user_data", JSON.stringify(updatedUser));

        console.log("User data refreshed successfully:", response.data);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  // Handle initial authentication and data loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        console.log("Firebase auth state changed: User logged in");
        try {
          // Get a fresh token
          const idToken = await firebaseUser.getIdToken(true);
          console.log("Successfully retrieved Firebase token");

          // Check if we have cached user data
          const cachedUserData = localStorage.getItem("cached_user_data");
          if (cachedUserData) {
            const cachedUser = JSON.parse(cachedUserData);
            // Only use cached data if it's for the current user
            if (cachedUser.id === firebaseUser.uid) {
              setUser(cachedUser);
              console.log("Using cached user data:", cachedUser);

              // Don't return early, still call backend login to ensure session is established
              // but we'll use the cached data while waiting for the response
            }
          }

          // Call backend login to establish session
          try {
            const loginResponse = await authApi.login({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });

            console.log("Backend login successful:", loginResponse);

            // Then get additional user info - IMPORTANT: Don't overwrite subscription from backend
            // unless explicitly returned by getUser endpoint
            try {
              const response = await authApi.getUser();
              if (response.success && response.data) {
                // Check if user is admin
                const isAdmin = firebaseUser.email
                  ? ADMIN_EMAILS.includes(firebaseUser.email)
                  : false;

                // Get current cached user data if available
                const currentCachedData =
                  localStorage.getItem("cached_user_data");
                const cachedUser = currentCachedData
                  ? JSON.parse(currentCachedData)
                  : null;

                // Important: Only update subscription if it's explicitly provided by backend
                // or if we don't have it cached already
                const subscription =
                  response.data.subscription !== undefined
                    ? response.data.subscription
                    : cachedUser?.subscription || {
                        id: null,
                        status: "active",
                        plan: "free",
                        cancel_at_period_end: false,
                      };

                const updatedUser = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: response.data.displayName,
                  subscription: subscription,
                  isAdmin: isAdmin || response.data.role === "admin",
                };

                setUser(updatedUser);

                // Cache user data
                localStorage.setItem(
                  "cached_user_data",
                  JSON.stringify(updatedUser)
                );
              } else {
                // If backend fetch fails, preserve subscription from cached data if available
                const currentCachedData =
                  localStorage.getItem("cached_user_data");
                const cachedUser = currentCachedData
                  ? JSON.parse(currentCachedData)
                  : null;
                const isAdmin = firebaseUser.email
                  ? ADMIN_EMAILS.includes(firebaseUser.email)
                  : false;

                const defaultSubscription = {
                  id: null,
                  status: "active",
                  plan: "free",
                  cancel_at_period_end: false,
                };

                const basicUser = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  subscription: cachedUser?.subscription || defaultSubscription,
                  isAdmin: isAdmin,
                };

                setUser(basicUser);

                // Cache basic user data
                localStorage.setItem(
                  "cached_user_data",
                  JSON.stringify(basicUser)
                );
              }
            } catch (error) {
              console.error("Error fetching user details:", error);
              // Fallback to basic Firebase user but preserve subscription from cached data
              const currentCachedData =
                localStorage.getItem("cached_user_data");
              const cachedUser = currentCachedData
                ? JSON.parse(currentCachedData)
                : null;
              const isAdmin = firebaseUser.email
                ? ADMIN_EMAILS.includes(firebaseUser.email)
                : false;

              const defaultSubscription = {
                id: null,
                status: "active",
                plan: "free",
                cancel_at_period_end: false,
              };

              const fallbackUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                subscription: cachedUser?.subscription || defaultSubscription,
                isAdmin: isAdmin,
              };

              setUser(fallbackUser);

              // Cache fallback user data
              localStorage.setItem(
                "cached_user_data",
                JSON.stringify(fallbackUser)
              );
            }
          } catch (error) {
            console.error("Error during backend login:", error);
            toast.error(
              "Failed to connect to server. Using local authentication only."
            );
            // Still set basic user so UI shows as logged in, but preserve subscription from cached data
            const currentCachedData = localStorage.getItem("cached_user_data");
            const cachedUser = currentCachedData
              ? JSON.parse(currentCachedData)
              : null;
            const isAdmin = firebaseUser.email
              ? ADMIN_EMAILS.includes(firebaseUser.email)
              : false;

            const defaultSubscription = {
              id: null,
              status: "active",
              plan: "free",
              cancel_at_period_end: false,
            };

            const offlineUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              subscription: cachedUser?.subscription || defaultSubscription,
              isAdmin: isAdmin,
            };

            setUser(offlineUser);

            // Cache offline user data
            localStorage.setItem(
              "cached_user_data",
              JSON.stringify(offlineUser)
            );
          }
        } catch (error) {
          console.error("Error getting Firebase token:", error);
          toast.error("Authentication error. Please try logging in again.");
          setUser(null);
          localStorage.removeItem("cached_user_data");
        }
      } else {
        console.log("Firebase auth state changed: User logged out");
        setUser(null);
        localStorage.removeItem("cached_user_data");
      }

      setLoading(false);
      setInitialLoadComplete(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, firebaseUser, refreshToken, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  return context;
};

export default useFirebaseAuth;
