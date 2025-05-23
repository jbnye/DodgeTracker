import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import LeaderboardEntry from "./LeaderboardEntry.js";
import Pagination from "./LeaderboardPage.js";

export default function LeaderboardTable({ region }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/api/leaderboard?page=${currentPage}&region=${region}`
    ) // Fetch from backend
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data.data); // Store data in state
        setTotalPages(data.totalPages);
        setLoading(false);
        //console.log("Leaderboard Data:", data.data);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, [currentPage, region]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
    <div
      className="leaderboardTable"
      style={{
        height: "100%",
        width: "70%",
        margin: "auto",
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      {leaderboard.map((player, index) => (
        <LeaderboardEntry
          key={index}
          rank={(currentPage - 1) * 25 + index + 1} // Adjust rank based on page
          player={player}
        />
      ))}
      {/* Use the Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
