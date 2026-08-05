import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const STORAGE_KEY = "voyageai_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const registerUser = async (payload) => {
    const data = await authService.register(payload);
    persist(data);
    toast.success(`Welcome to VoyageAI, ${data.name.split(" ")[0]}!`);
    return data;
  };

  const loginUser = async (payload) => {
    const data = await authService.login(payload);
    persist(data);
    toast.success(`Welcome back, ${data.name.split(" ")[0]}!`);
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUserData = (partial) => {
    const updated = { ...user, ...partial };
    persist(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        registerUser,
        loginUser,
        logoutUser,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
