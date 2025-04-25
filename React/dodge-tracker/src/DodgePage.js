import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DodgeList2 from "./components/DodgeList2.js";
import DodgeTimer from "./components/DodgeTimer.js";
import io from "socket.io-client";

export default function DodgePage() {
  const [socket, setSocket] = useState(null);
  const { region } = useParams(); // Directly destructure as 'region'
  const upperRegion = region.toUpperCase(); // Will throw if region is undefined

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      autoConnect: true, // Explicitly enable
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    // Track connection state
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocket(null);
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.disconnect();
    };
  }, []);

  if (!socket) {
    return (
      <div className="connection-status">Connecting to live updates...</div>
    );
  }

  return (
    <div>
      <div>
        <h1>{upperRegion} Dodge Tracker </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifySelf: "center",
          fontSize: "22px",
        }}
      >
        <DodgeTimer socket={socket} region={upperRegion} />
      </div>
      <DodgeList2 socket={socket} region={upperRegion} />
    </div>
  );
}
