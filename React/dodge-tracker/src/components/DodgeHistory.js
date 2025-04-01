import react from "react";
import DodgeHistoryItem from "DodgeHistoryItem.js";
import TimePeriodDropDown from "./TimePeriodDropDown";

export default function DodgeHistory(iconId, gameName, tagLine, dodgeData) {
  const [season, setSeason] = useState("season15");
  const [dodgeHistory, setDodgeHistory] = useState(dodgeData["season15"]);

  return (
    <div>
      <TimePeriodDropDown currentSeason={season} onSeasonChange={setSeason} />
      <DodgeHistoryItem />
    </div>
  );
}
