import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DodgeItem2 from "./DodgeItem2.js";
import io from "socket.io-client";

export default function DodgeList2() {
  const [dodgeList, setDodgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newDodgeIds, setNewDodgeIds] = useState(new Set());
  const { region } = useParams();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/dodgeList?region=${region}`) // Fetch from backend
      .then((response) => response.json())
      .then((data) => {
        setDodgeList(data.data); // Store data in state
        setLoading(false);
        console.log("Dodgelist:", data.data);
      })
      .catch((error) => console.error("Error fetching dodge list:", error));

    const socket = io("http://127.0.0.1:5000");
    socket.on("new_dodge", (newDodge) => {
      console.log("New dodge received:", newDodge);

      setNewDodgeIds((prev) => {
        const updated = new Set(prev);
        updated.add(newDodge.dodgeId);
        return updated;
      });

      setDodgeList((prev) => [newDodge, ...prev]);

      // Remove from "new" set after animation completes (e.g., 2 seconds)
      setTimeout(() => {
        setNewDodgeIds((prev) => {
          const updated = new Set(prev);
          updated.delete(newDodge.dodgeId);
          return updated;
        });
      }, 2000);
    });

    return () => {
      console.log("Disconnecting WebSocket...");
      socket.disconnect();
    };
  }, [region]); //DEPENDANCY ARRAY TO ONLY RENDER ON INITIAL!!!!!

  if (loading) {
    return <div>Loading...</div>; // Show a loading message
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
      {dodgeList.map((item, index) => (
        <DodgeItem2
          key={item.dodgeId || index}
          item={item}
          isNew={newDodgeIds.has(item.dodgeId)}
          currentTime={currentTime}
          region={region}
        />
      ))}
    </ul>
  );
}
