import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SummonerHeader from "./components/SummonerHeader.js";
import DodgeHistory from "./components/DodgeHistory.js";

export default function SummonerPage() {
  const [summonerData, setSummonerData] = useState(null);
  const [dodgeData, setDodgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accountName } = useParams();
  const { region } = useParams();

  const [gameName, tagLine] = accountName.split("-");
  console.log(accountName, gameName, tagLine);
  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/api/player?gameName=${gameName}&tagLine=${tagLine}&region=${region}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSummonerData(data.summoner);
        setDodgeData(data.dodge);
        setLoading(false);
        console.log("Summoner Data:", data.summoner);
        console.log("Dodge Data:", data.dodge);
      })
      .catch((error) => {
        console.error("Error fetching summoner:", error);
      });
  }, [gameName, tagLine]);

  if (loading) return <p>Loading summoner data...</p>;
  if (!summonerData || summonerData.error) return <p>Summoner not found.</p>;

  return (
    <div>
      <div
        style={{
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
          //height: "300px",
          backgroundColor: "rgb(82 82 91)",
          borderBottom: "3px solid black",
        }}
      >
        <SummonerHeader
          summonerData={summonerData}
          dodgeData={dodgeData}
          gameName={gameName}
          tagLine={tagLine}
          rank_image={getRankImage(summonerData["rank"])}
        />
      </div>
      <DodgeHistory
        dodgeData={dodgeData}
        gameName={gameName}
        tagLine={tagLine}
        iconId={summonerData["iconId"]}
        gamesPlayed={summonerData["gamesPlayed"]}
      />
    </div>
  );
}

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
