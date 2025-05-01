import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SummonerHeader from "./components/SummonerHeader.js";
import DodgeHistory from "./components/DodgeHistory.js";
import DodgeRank from "./components/DodgeRank.js";

export default function SummonerPage() {
  const [summonerData, setSummonerData] = useState(null);
  const [dodgeData, setDodgeData] = useState(null);
  const [dodgeRank, setDodgeRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accountName } = useParams();
  const { region } = useParams();

  const [gameName, tagLine] = accountName.split("-");
  //console.log(accountName, gameName, tagLine);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/api/player?gameName=${gameName}&tagLine=${tagLine}&region=${region}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSummonerData(data.summoner);
        setDodgeData(data.dodge);
        setLoading(false);
        //console.log("Summoner Data:", data.summoner);
        //console.log("Dodge Data:", data.dodge);
      })
      .catch((error) => {
        console.error("Error fetching summoner:", error);
      });
  }, [region, gameName, tagLine]);

  useEffect(() => {
    const fetchDodgeRank = async () => {
      try {
        if (!summonerData || !summonerData.summonerId) {
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:5000/api/ladder-rank?region=${region}&summonerId=${summonerData["summonerId"]}`
        );
        const data = await response.json();
        setDodgeRank(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching dodge list:", error);
      }
    };
    fetchDodgeRank();
  }, [summonerData, region]);

  if (loading) return <p>Loading summoner data...</p>;
  if (!summonerData || summonerData.error)
    return (
      <>
        <h1>ERROR 404</h1> <p>Summoner not found.</p>
      </>
    );

  return (
    <div>
      <DodgeRank dodgeRank={dodgeRank} />
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
          region={region}
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
