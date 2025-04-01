export default function SummonerHeader({
  summonerData,
  dodgeData,
  gameName,
  tagLine,
  rank_image,
}) {
  return (
    <div>
      <img
        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerData["iconId"]}.jpg`}
        alt="Profile Icon"
        style={{ width: "120px", height: "120px" }}
      />
      {summonerData["summonerLevel"]}
      {gameName + "#" + tagLine}
      <a
        href={`https://www.op.gg/summoners/na/${gameName}-${tagLine}`}
        target="_blank"
        rel="noreferrer"
      >
        OP.GG
      </a>
      <img
        src={`${rank_image}`}
        alt="Rank Icon"
        style={{ width: "40px", height: "40px" }}
      />
    </div>
  );
}
