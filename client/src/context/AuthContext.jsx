import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page refresh par token se user wapas laao
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  // Token save karke latest user (role ke saath) server se lao
  const finishLogin = async (token) => {
    localStorage.setItem("token", token);
    const me = await api.get("/auth/me");
    setUser(me.data.user);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    await finishLogin(res.data.token);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    await finishLogin(res.data.token);
  };

  const googleLogin = async (credential) => {
    const res = await api.post("/auth/google", { credential });
    await finishLogin(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);