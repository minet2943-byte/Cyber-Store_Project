import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "cyber-store-auth";
const USERS_KEY = "cyber-store-users";
const ADMIN_EMAIL = "admin@cyberstore.com";
const ADMIN_PASSWORD = "Admin@123";

function loadStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}


function saveStoredUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function loadStoredUsers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser());
  const [users, setUsers] = useState(() => loadStoredUsers());

  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  const register = ({ name, email, password }) => {
    if (email === ADMIN_EMAIL || users.some((user) => user.email === email)) {
      return { success: false, message: "Email already registered." };
    }

    const newUser = { name, email, password, role: "customer" };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const login = ({ email, password }) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email, role: "admin" };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    const existingUser = users.find(
      (existing) => existing.email === email && existing.password === password,
    );

    if (existingUser) {
      setUser(existingUser);
      return { success: true, user: existingUser };
    }

    return { success: false, message: "Invalid email or password." };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
