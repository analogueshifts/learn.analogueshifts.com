"use client";
import { createContext, useContext, useState } from "react";

const ToastContext: any = createContext(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState("");
  const [position, setPosition] = useState("right");
  const [message, setMessage] = useState("");

  return (
    <ToastContext.Provider
      value={{ toast, setToast, position, setPosition, message, setMessage }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
