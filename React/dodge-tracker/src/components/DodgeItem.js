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
}) => {
  return (
    <div className="dodge-item flex items-center p-4 bg-white shadow-md rounded-md mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-grow">
        <p className="font-bold">{name}</p>
      </div>
      <div className="flex items-center mx-4">
        <img src={rankImage} alt="Rank" className="w-8 h-8 mr-2" />
        <p>{lp} LP</p>
      </div>
      <div className="flex items-center mx-4">
        <p>{dodgeAmount} Dodges</p>
      </div>
      <div className="ml-auto">
        <p>{timeDifference}</p>
      </div>
    </div>
  );
};

export default DodgeItem;
