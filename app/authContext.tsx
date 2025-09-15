// app/authContext.tsx

"use client";

import { getSessionClient } from "@/utils/auth";
import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import { ReadonlyURLSearchParams } from "next/navigation";
import React, {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthInitializer } from "./AuthInitializer";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // ADDED: A new function to handle URL parameters safely
  handleUrlParams: (params: ReadonlyURLSearchParams) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // This effect handles checking the session cookie on initial load.
    // It remains unchanged.
    if (localStorage.getItem("isAuth") === null) {
      localStorage.setItem("isAuth", "false");
    }
    if (localStorage.getItem("isLoggedIn") === null) {
      localStorage.setItem("isLoggedIn", "false");
    }
    // ... (other localStorage initializations)

    const checkSession = async () => {
      const sessionId = Cookies.get("session_id");
      if (process.env.NODE_ENV === "development") {
        console.log("Session ID from cookies:", sessionId);
      }
      if (sessionId) {
        const session = await getSessionClient();
        if (session) {
          setIsLoggedIn(true);
          setUser({
            id: session.id,
            name: session.name,
            email: session.email,
          });
          localStorage.setItem("isAuth", "true");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", sessionId);
          localStorage.setItem("getSession", JSON.stringify(session));
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    };

    checkSession();
  }, []);

  // ADDED: This function will receive the search params from AuthInitializer
  // This is where you can safely handle URL-based logic (e.g., tokens, redirects)
  const handleUrlParams = (params: ReadonlyURLSearchParams) => {
    const token = params.get("token");
    if (token) {
      // Example: handle a login token from a magic link
      console.log("Token found in URL:", token);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const result = response.data;
      setIsLoggedIn(true);
      setUser({
        id: result.userId,
        name: result.userName,
        email: result.userEmail,
      });
      Cookies.set("session_id", result.sessionId);
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", result.sessionId);
      localStorage.setItem("getSession", JSON.stringify(result));
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      clearAuthData();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  const clearAuthData = () => {
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove("session_id");
    localStorage.setItem("isAuth", "false");
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("token", "");
    localStorage.setItem("getSession", "");
  };

  // The context value now includes the new handler function
  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
    handleUrlParams,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {/* This is the core of the fix. We wrap the special AuthInitializer 
        in a Suspense boundary. This tells Next.js to wait for it, 
        preventing the build error.
      */}
      <Suspense fallback={null}>
        <AuthInitializer />
      </Suspense>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};