import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import DodgeItem2 from "./DodgeItem2.js";

export default function DodgeList2({ socket, region }) {
  const [dodgeList, setDodgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newDodgeIds, setNewDodgeIds] = useState(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Effect 1: Fetch initial dodge list
    const fetchDodgeList = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/dodgeList?region=${region}`
        );
        const data = await response.json();
        setDodgeList(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dodge list:", error);
      }
    };

    fetchDodgeList();
  }, [region]); // Runs once on mount and when region changes

  useEffect(() => {
    // Effect 2: Handle socket events
    if (!socket) return;

    const handleNewDodge = (newDodge) => {
      if (newDodge.region !== region) return;

      const newKey = getDodgeKey(newDodge);
      setDodgeList((prev) => [newDodge, ...prev]);
      setNewDodgeIds((prev) => new Set(prev).add(newKey));

      setTimeout(() => {
        setNewDodgeIds((prev) => {
          const updated = new Set(prev);
          updated.delete(newKey);
          return updated;
        });
      }, 2000);
    };

    socket.on("new_dodge", handleNewDodge);

    return () => {
      socket.off("new_dodge", handleNewDodge);
    };
  }, [socket, region]); // Re-subscribes if socket or region changes

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px", // Adjust as needed
        }}
      >
        <ClipLoader
          color="#FAFAFA" // You can change this color
          size={40} // Adjust size
          margin={4} // Adjust spacing
          speedMultiplier={1} // Adjust speed
        />
      </div>
    );
  }

  return (
    <ul
      className="dl"
      style={{
        height: "100%",
        width: "70%",
        margin: "auto",
      }}
    >
      {dodgeList.map((item) => {
        const key = getDodgeKey(item);
        return (
          <DodgeItem2
            key={key}
            item={item}
            isNew={newDodgeIds?.has(key) ?? false} // Optional chaining + nullish coalescing
            currentTime={currentTime}
            region={region}
          />
        );
      })}
    </ul>
  );
}

function getDodgeKey(dodge) {
  return dodge["dodgeDate"] + dodge["gameName"];
}
