import { createContext, useContext, useEffect, useState } from "react";
import api from "../service/api";

const AuthContext = createContext(null);

const isAdminRole = (roleValue) => {
  if (roleValue == null) return false;

  const roleText = Array.isArray(roleValue)
    ? roleValue.join(" ")
    : String(roleValue);

  const normalized = roleText.toLowerCase().replace(/[_-]/g, " ");
  return (
    normalized.includes("admin") ||
    normalized.includes("super admin") ||
    normalized.includes("superadmin")
  );
};

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const getUserRoleFromToken = (jwtToken) => {
  if (!jwtToken || typeof jwtToken !== "string") return null;

  try {
    const payload = jwtToken.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(normalized)
          .split("")
          .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(""),
      ),
    );

    return decoded.role ?? decoded.userRole ?? decoded.roles ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Sync token state changes with localStorage and set user state
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      const savedUser = getStoredUser();
      if (!savedUser) {
        const roleFromToken = getUserRoleFromToken(token);
        if (roleFromToken) {
          setUser((prev) => prev ?? { role: roleFromToken });
        }
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, [token]);

  /**
   * Register a new user
   * @param {Object} credentials - { name, email, password }
   */
  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    const payload = response.data?.data ?? response.data;
    const jwtToken = payload?.token ?? payload?.jwt ?? payload?.accessToken;
    const userProfile =
      payload?.user ?? payload?.profile ?? payload?.data?.user ?? payload;

    if (jwtToken) {
      setToken(jwtToken);

      const finalUser = userProfile || { role: getUserRoleFromToken(jwtToken) };
      if (finalUser) {
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      }

      return { success: true, user: finalUser };
    }

    return { success: false, message: "Token not received from server." };
  };

  /**
   * Log in an existing user
   */
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const payload = response.data?.data ?? response.data;
    const jwtToken = payload?.token ?? payload?.jwt ?? payload?.accessToken;
    const userProfile =
      payload?.user ?? payload?.profile ?? payload?.data?.user ?? payload;

    if (jwtToken) {
      setToken(jwtToken);

      const finalUser = userProfile || { role: getUserRoleFromToken(jwtToken) };
      if (finalUser) {
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
      }

      return { success: true, user: finalUser };
    }

    return { success: false, message: "Invalid credentials." };
  };

  /**
   * Log out user and purge stored token
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    localStorage.removeItem("auth_token");
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isAdmin: isAdminRole(user?.role ?? user?.userRole ?? user?.roles),
    register,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
