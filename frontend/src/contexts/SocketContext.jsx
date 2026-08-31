import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = localStorage.getItem("kanuorietech_token");

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,

      auth: {
        token,
      },
    });

    newSocket.on("connect", () => {
      console.log("🟢 Socket Connected:", newSocket.id);

      if (user?._id) {
        newSocket.emit("join-user-room", user._id);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔴 Socket Disconnected:", reason);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket Error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export default SocketContext;
