import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("learnhub_token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("learnhub_token");
          setToken("");
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("learnhub_token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    localStorage.setItem("learnhub_token", data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    return data;
  };

  const register = async (name, email, password, adminCode) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, adminCode })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    localStorage.setItem("learnhub_token", data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("learnhub_token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
