import React from "react";
import "./DodgeItem.css"; // Custom styles for DodgeItem

const rankIcons = {
  challenger:
    "https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends)?file=Season_2023_-_Challenger.png",
  grandmaster:
    "https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends)?file=Season_2023_-_Grandmaster.png",
  master:
    "https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends)?file=Season_2023_-_Master.png",
};

const DodgeItem = ({
  image,
  name,
  rankImage,
  lp,
  dodgeAmount,
  timeDifference,
  className, // Accept className from props
}) => {
  return (
    <div
      className={`dodge-item flex items-center p-4 shadow-md rounded-md ${className}`}
    >
      {/* Summoner Icon and Name */}
      <div className="flex items-center mr-auto">
        <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <p className="font-bold">{name}</p>
      </div>

      {/* Rank and LP */}
      <div className="flex items-center ml-6 mr-4">
        <img src={rankImage} alt="Rank" className="w-8 h-8 mr-2" />
        <p>{lp} LP</p>
      </div>

      {/* Number of Dodges */}
      <div className="flex items-center ml-8 mr-4">
        <p>-{dodgeAmount} LP</p>
      </div>

      {/* Time Difference */}
      <div className="ml-auto">
        <p>{timeDifference}</p>
      </div>
    </div>
  );
};

export default DodgeItem;
