import { createContext, useContext, useState } from "react";
import { useEffect , useMemo} from "react";
import { refreshSession } from "../services/AuthService.js";
import tokenManager from "../services/tokenManager.js";
import API from "@/api/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const value = useMemo(() => ({
    accessToken,
    setAccessToken,
    user,
    setUser,
    isAuthLoading,
  }), [accessToken, user, isAuthLoading]);

  // On app load, try to refresh session
  useEffect(() => {
    async function initializeAuth() {
      try {
        const data = await refreshSession();

        setAccessToken(data.accessToken);
        tokenManager.setAccessToken(data.accessToken);
        try {
          const res = await API.get("/auth/me");
          setUser(res.data);
        } catch (err) {
          console.log("Failed to fetch user after refresh", err?.response || err);
        }
      } catch (err) {
        console.log("No active session");
      } finally {
        setIsAuthLoading(false);
      }
    }

    initializeAuth();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
