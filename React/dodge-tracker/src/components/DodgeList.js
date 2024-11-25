import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import DodgeItem from "./DodgeItem.js";

const DodgeList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000");

    // Fetch data from Flask API
    fetch("http://127.0.0.1:5000/api/dodge-items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data); // Set the state with the fetched data
        console.log(data); // Print out the data to the console
      })
      .catch((error) => console.error("Error fetching data:", error));

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    // Listen for 'new_dodge' event
    socket.on("new_dodge", (newDodge) => {
      console.log("New dodge received:", newDodge);
      setItems((prevItems) => [newDodge, ...prevItems]);
    });
    socket.onAny((event, ...args) => {
      console.log(`Event: ${event}`, args); // Log all received events
    });
    // // Cleanup WebSocket connection on component unmount
    return () => {
      console.log("Disconnecting socket:", socket.id);
      socket.disconnect();
    };
  }, []);

  // Function to get the rank image URL based on rank
  const getRankImage = (rank) => {
    const rankImages = {
      master:
        "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/master.svg",
      grandmaster:
        "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/grandmaster.svg",
      challenger:
        "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/challenger.svg",
    };
    return rankImages[rank.toLowerCase()];
  };

  const timeAgo = (dateString) => {
    // Parse the date directly in the RFC 1123 format
    const date = new Date(dateString);

    // Check if date parsing was successful
    if (isNaN(date.getTime())) {
      console.log("Invalid date format:", dateString); // Debugging output
      return "Invalid date";
    }

    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo} minutes ago`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      const minutesAgo = Math.floor((secondsAgo % 3600) / 60);
      return `${hoursAgo} hours ${minutesAgo} minutes ago`;
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
    }
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
        <DodgeItem
          key={item.dodgeId || index} // Fallback to index if dodgeId is missing
          rankImage={getRankImage(item.rank)} // Get the rank image URL here
          leaguePoints={item.leaguePoints} // Use `leaguePoints` instead of `lp`
          lpLost={item.lpLost} // Use `lpLost` instead of `dodgeAmount`
          gameName={item.gameName}
          tagLine={item.tagLine}
          summonerLevel={item.summonerLevel}
          iconId={item.iconId} // Assuming you need `iconId` for profile icons
          timeDifference={timeAgo(item.dodgeDate)}
        />
      ))}
    </ul>
  );
};

export default DodgeList;
