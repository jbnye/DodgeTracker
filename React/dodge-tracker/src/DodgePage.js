import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSocket } from "./SocketContext";
import DodgeList2 from "./components/DodgeList2.js";
import DodgeTimer from "./components/DodgeTimer.js";

export default function DodgePage() {
  const { socket, connectionStatus, wasEverConnected } = useSocket();
  const [regionTotal, setRegionTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { region } = useParams();
  const upperRegion = region.toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:5000/api/regionTotal?region=${region}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setRegionTotal(data.data.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching region total:", error);
        //setConnectionStatus("disconnected");
        setTimeout(fetchData, 5000);
      }
    };

    fetchData();
  }, [region]); // Only region as dependency

  if (connectionStatus !== "connected" && !wasEverConnected) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <ClipLoader color="#FAFAFA" size={40} />
      </div>
    );
  }
  if (connectionStatus === "disconnected" && wasEverConnected) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#FAFAFA",
        }}
      >
        <h1>Connection lost - reconnecting</h1>
        <ClipLoader color="#FAFAFA" size={40} />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <ClipLoader color="#FAFAFA" size={40} />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          borderBottom: "solid black 3px",
          borderLeft: "solid black 3px",
          borderRight: "solid black 3px",
          justifySelf: "end",
          padding: "5px",
        }}
      >
        Total Master+ Players in {upperRegion + ": " + regionTotal}
      </div>
      <div>
        <h1>{upperRegion} Dodge Tracker</h1>
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
      {socket && <DodgeList2 socket={socket} region={upperRegion} />}
    </div>
  );
}
