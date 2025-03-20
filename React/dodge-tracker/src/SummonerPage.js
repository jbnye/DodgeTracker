import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function SummonerPage() {
  const [gameName, tagLine] = useParams();
  const [summoner, setSummoner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/api/player?gameName=${gameName}&tagLine=${tagLine}`
    )
      .then((response) => response.json())
      .then((data) => {
        //setSummoner(data);
        //setLoading(false);
        console.log("Summoner Data:", data);
      })
      .catch((error) => {
        console.error("Error fetching summoner:", error);
      });
  }, [gameName, tagLine]);

  if (loading) return <p>Loading summoner data...</p>;
  if (!summoner || summoner.error) return <p>Summoner not found.</p>;

  return <p>data</p>;
}
