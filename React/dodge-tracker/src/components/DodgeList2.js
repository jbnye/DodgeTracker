import React, { useState, useEffect } from "react";
import DodgeItem2 from "./DodgeItem2.js";

export default function DodgeList2() {
  const [dodgeList, setDodgeList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/dodgeList`) // Fetch from backend
      .then((response) => response.json())
      .then((data) => {
        setDodgeList(data.data); // Store data in state
        setLoading(false);
        console.log("Leaderboard Data:", data.data);
      })
      .catch((error) => console.error("Error fetching dodge list:", error));
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
        <DodgeItem2 key={item.dodgeId || index} item={item} />
      ))}
    </ul>
  );
}
