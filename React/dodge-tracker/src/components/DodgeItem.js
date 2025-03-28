import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Helper function to calculate time difference
const calculateTimeDifference = (dodgeDate) => {
  const now = new Date();
  const dodgeTime = new Date(dodgeDate);

  const secondsAgo = Math.floor((now - dodgeTime) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    const remainingSeconds = secondsAgo % 60;
    return `${minutesAgo} minutes ${remainingSeconds} seconds ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    const minutesAgo = Math.floor((secondsAgo % 3600) / 60);
    return `${hoursAgo} hours ${minutesAgo} minutes ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  }
};

const DodgeItem = ({
  rankImage, // Matches the `rank` prop passed in DodgeList
  leaguePoints, // Matches the `leaguePoints` prop
  lpLost, // Matches `lpLost`
  gameName,
  tagLine,
  summonerLevel,
  iconId, // Matches `iconId`
  dodgeDate, // Timestamp of the dodge
  style,
}) => {
  const [timeDifference, setTimeDifference] = useState(
    calculateTimeDifference(dodgeDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDifference(calculateTimeDifference(dodgeDate));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [dodgeDate]);

  const [isHovered, setIsHovered] = useState(false);

  // Functions to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <li
      className="di"
      style={{
        display: "flex", // Flexbox for horizontal layout
        alignItems: "center", // Center align items vertically
        padding: "16px", // Padding around the item
        borderBottom: "2px solid black", // Notable bottom border
        backgroundColor: isHovered
          ? "#737373"
          : style?.backgroundColor || "#858484",
        cursor: "pointer", // Add pointer cursor for hover effect
        ...style, // Apply alternating background color
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left: Summoner Icon and Name */}
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <img
          src={
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/" +
            iconId +
            ".jpg"
          }
          alt={"Profile Icon"}
          style={{
            width: "50px",
            height: "50px",
            marginRight: "10px",
          }}
        />
        <span style={{ fontWeight: "bold" }}>{gameName + "#" + tagLine}</span>
      </div>

      {/* Middle: Rank Image and LP */}
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <img
          src={rankImage}
          alt="Rank"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <span>{leaguePoints} LP</span>
      </div>

      {/* Middle: LP Lost */}
      <div style={{ flex: "1", textAlign: "center" }}>
        <span>-{lpLost} LP</span>
      </div>

      {/* Right: Time Difference */}
      <div style={{ flex: "1", textAlign: "right" }}>
        <span>{timeDifference}</span>
      </div>
    </li>
  );
};

const DodgeList = () => {
  const [items, setItems] = useState([]);
  const [animatedIndexes, setAnimatedIndexes] = useState([]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000");

    socket.on("new_dodge", (newDodge) => {
      console.log("New dodge received:", newDodge);
      setItems((prevItems) => {
        const newItems = [newDodge, ...prevItems];
        setAnimatedIndexes([0]); // Mark the new item for animation
        return newItems;
      });
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      console.log("Disconnecting socket:", socket.id);
      socket.disconnect();
    };
  }, []);

  const animationStyles = {
    animation: "slideIn 0.5s ease-in-out",
    opacity: 1,
    transform: "translateY(0)",
  };

  const initialStyles = {
    opacity: 0,
    transform: "translateY(-20px)",
  };

  return (
    <ul
      className="dl"
      style={{
        listStyleType: "none", // Remove bullets
        padding: "0", // Reset padding
        margin: "0 15%", // 15% margin left and right
      }}
    >
      {items.map((item, index) => (
        <li
          key={index}
          style={{
            ...(animatedIndexes.includes(index)
              ? animationStyles
              : initialStyles),
          }}
        >
          <DodgeItem
            rankImage={item.rankImage}
            leaguePoints={item.leaguePoints}
            lpLost={item.lpLost}
            gameName={item.gameName}
            tagLine={item.tagLine}
            summonerLevel={item.summonerLevel}
            iconId={item.iconId}
            dodgeDate={item.dodgeDate} // Pass timestamp here
          />
        </li>
      ))}
    </ul>
  );
};

export default DodgeList;
