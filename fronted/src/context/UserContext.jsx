import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/user/me/");
        setUser(response.data);
      } catch (error) {
        console.log("User not authenticated");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
