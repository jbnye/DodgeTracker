import React, { useState, useEffect } from "react";
import DodgeItem2 from "./DodgeItem2.js";
import io from "socket.io-client";

export default function DodgeList2() {
  const [dodgeList, setDodgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fancyDodge, setFancyDodge] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/dodgeList`) // Fetch from backend
      .then((response) => response.json())
      .then((data) => {
        setDodgeList(data.data); // Store data in state
        setLoading(false);
        //console.log("Leaderboard Data:", data.data);
      })
      .catch((error) => console.error("Error fetching dodge list:", error));

    const socket = io("http://127.0.0.1:5000");
    socket.on("new_dodge", (newDodge) => {
      console.log("New dodge receieved:", newDodge);
      setDodgeList((prevList) => [newDodge, ...prevList]);
      setFancyDodge((prevList) => [0, ...prevList]);
    });

    return () => {
      console.log("Disconnecting WebSocket...");
      socket.disconnect();
    };
  }, []); //DEPENDANCY ARRAY TO ONLY RENDER ON INITIAL!!!!!

  if (loading) {
    return <div>Loading...</div>; // Show a loading message
  }

  return (
    <ul
      className="dl"
      style={{
        listStyleType: "none", // Remove bullets
        padding: "0", // Reset padding
        margin: "0 15%", // 15% margin left and right
      }}
    >
      {dodgeList.map((item, index) => (
        <DodgeItem2
          key={item.dodgeId || index}
          item={item}
          isNew={fancyDodge.includes(index)}
        />
      ))}
    </ul>
  );
}
