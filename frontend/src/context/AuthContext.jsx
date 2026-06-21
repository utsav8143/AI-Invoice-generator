import React  from "react";
import  {useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, useData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(useData));

    setUser(useData);
    setIsAuthenticated(true);
  };


const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  setUser(null);
  setIsAuthenticated(false);
  window.location.href = "/";
};

const updateUser = async (updatedUserData) => {
  const newUserData = { ...user, ...updatedUserData };
  localStorage.setItem("user", JSON.stringify(newUserData));
  setUser(newUserData);
};

const value = {
  user,
  loading,
  isAuthenticated,
  login,
  logout,
  updateUser,
  checkAuthStatus,
};
return( <AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};