import React from "react";

export default function LeaderboardEntry({ rank, player }) {
  return (
    <div>
      {rank}
      <img
        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.iconId}.jpg`}
        alt="Profile Icon"
        style={{ width: "30px", height: "30px", marginRight: "10px" }}
      />
      {player.gameName + "#" + player.tagLine} {player.rank}{" "}
      {player.leaguePoints} {player.totalDodges} dodges
    </div>
  );
}
