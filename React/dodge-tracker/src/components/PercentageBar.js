import React from "react";
import "./PercentageBar.css"; // Optional for styling

const PercentageBar = ({ total, greenValue }) => {
  // Calculate percentages
  const redValue = total - greenValue;
  console.log(total, greenValue, redValue);
  const greenPercent = Math.round((greenValue / total) * 100);
  const redPercent = 100 - greenPercent; // Or calculate separately if needed

  return (
    <div className="percentage-bar-container">
      <div className="percentage-bar">
        {/* Green segment */}
        <div className="green-segment" style={{ width: `${greenPercent}%` }}>
          <span className="percentage-label">{greenPercent}%</span>
        </div>

        {/* Red segment */}
        <div className="red-segment" style={{ width: `${redPercent}%` }}>
          <span className="percentage-label">{redPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default PercentageBar;
