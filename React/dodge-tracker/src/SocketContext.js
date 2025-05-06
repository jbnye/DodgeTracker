import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

// Create context
export const SocketContext = createContext();

// Create provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [wasEverConnected, setWasEverConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      setSocket(socketInstance);
      setConnectionStatus("connected");
      setWasEverConnected(true);
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, connectionStatus, wasEverConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Create custom hook
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
