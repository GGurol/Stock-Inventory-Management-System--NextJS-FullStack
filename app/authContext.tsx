"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionClient } from "@/utils/auth";
import axiosInstance from "@/utils/axiosInstance";
import Loading from "@/components/Loading";

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setAuthLoading] = useState(true);

  const clearAuthData = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Initial session check on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await getSessionClient(); // backend API reads HTTPOnly cookie
        if (sessionUser) {
          setUser(sessionUser);
          setIsLoggedIn(true);
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Session check failed.", error);
        clearAuthData();
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const result = response.data;

      // Cookie already HTTPOnly, no need to set it from client
      setUser({
        id: result.id,
        name: result.name,
        email: result.email,
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in:", error);
      clearAuthData();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Server logout failed, clearing client session anyway.", error);
    } finally {
      clearAuthData();
      router.push("/login");
    }
  };

  if (isAuthLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
