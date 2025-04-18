import "./box.css";
export default function DodgeHistoryItem({
  date,
  lpLost,
  leaguePoints,
  rank,
  gameName,
  iconId,
  tagLine,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "50% 20% 10% 20%",
        borderBottom: "1px solid black",
        paddingTop: "5px",
        paddingBottom: "5px",
        fontSize: "20px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`}
          alt="Profile Icon"
          style={{ width: "50px", height: "50px" }}
        />
        <div>{gameName + "#" + tagLine}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={getRankImage(rank)}
          alt="Profile Icon"
          style={{
            height: "40px",
            width: "40px",
          }}
        />
        {leaguePoints}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div className={lpLost <= 5 ? "smallDodge" : "bigDodge"}>
          -{lpLost} LP
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifySelf: "end",
          gap: "10px",
        }}
      >
        <div className="timeDif">{timeDifference(date)}</div>
      </div>
    </div>
  );
}

const getRankImage = (rank) => {
  if (rank === "demoted") rank = "master";
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
function timeDifference(dodgeDate) {
  const dodgeTime = new Date(dodgeDate);
  const currentTime = Date.now();
  const secondsAgo = Math.floor((currentTime - dodgeTime) / 1000);
  if (secondsAgo < 60) {
    return `${secondsAgo}s ago`;
  } else if (secondsAgo < 300) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    const remainingSeconds = secondsAgo % 60;
    return `${minutesAgo}min ${remainingSeconds}s ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor((secondsAgo % 3600) / 60);
    return `${minutesAgo}min ago`;
  } else if (secondsAgo < 86400) {
    const minutesAgo = Math.floor((secondsAgo % 3600) / 60);
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo}h ${minutesAgo}m ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  }
}
