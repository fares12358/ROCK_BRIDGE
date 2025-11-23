"use client";

import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  const value = { isLogin, setIsLogin, user, setUser };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Custom hook - always call this inside components (must be used inside provider) */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (ctx === undefined) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return ctx;
}
