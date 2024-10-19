import React, { useState, useEffect } from "react";
import DodgeItem from "./DodgeItem.js";

const DodgeList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch data from Flask API
    fetch("http://127.0.0.1:5000/api/dodge-items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data); // Set the state with the fetched data
        console.log(data); // Print out the data to the console
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
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
          key={index}
          image={item.image}
          name={item.name}
          rankImage={item.rankImage}
          lp={item.lp}
          dodgeAmount={item.dodgeAmount}
          timeDifference={item.timeDifference}
          style // Alternating background
        />
      ))}
    </ul>
  );
};

export default DodgeList;
