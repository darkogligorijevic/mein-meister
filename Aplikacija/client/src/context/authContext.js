import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      inputs
    );
    const user = response.data;
    setCurrentUser(user);
    const token = user.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // update localStorage
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const updateIsMeister = (isMeister) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      isMeister,
    }));
    localStorage.setItem(
      "user",
      JSON.stringify({ ...currentUser, isMeister }) // update localStorage
    );
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateIsMeister }}>
      {children}
    </AuthContext.Provider>
  );
};
