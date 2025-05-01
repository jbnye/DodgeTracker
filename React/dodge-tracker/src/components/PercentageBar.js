import React from "react";
import "./PercentageBar.css"; // Optional for styling
import { Tooltip } from "react-tooltip";

const PercentageBar = ({ total, greenValue }) => {
  // Calculate percentages
  const redValue = total - greenValue;
  //console.log(total, greenValue, redValue);
  const greenPercent = Math.round((greenValue / total) * 100);
  const redPercent = 100 - greenPercent; // Or calculate separately if needed

  return (
    <>
      <button
        className="tooltip-anchor-button"
        data-tooltip-id="percentage-tooltip"
        aria-describedby="percentage-tooltip"
        style={{
          border: "none",
          background: "none",
          padding: 0,
          width: "100%",
          cursor: "pointer",
          display: "block", // Add this
        }}
      >
        <div className="percentage-bar-container">
          <div className="percentage-bar">
            {/* Green segment */}
            <div
              className="green-segment"
              style={{ width: `${greenPercent}%` }}
            >
              <span className="percentage-label">{greenPercent}%</span>
            </div>

            {/* Red segment */}
            <div className="red-segment" style={{ width: `${redPercent}%` }}>
              <span className="percentage-label">{redPercent}%</span>
            </div>
          </div>
        </div>
      </button>
      <Tooltip
        id="percentage-tooltip"
        style={{ zIndex: 1000 }}
        opacity={100}
        offset={5}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            minHeight: "50px",
            minWidth: "200px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            Short/Long Dodge Percentages
          </span>
          {greenValue > 0 && (
            <>
              <span>
                <span style={{ color: "#c3ba3c" }}>
                  {greenValue} out of {total}
                </span>{" "}
                dodges with LP loss ≤ 5
              </span>
            </>
          )}
          {redValue > 0 && (
            <span>
              <span style={{ color: "#a15e62" }}>
                {redValue} out of {total}{" "}
              </span>
              <span>dodges with LP loss {">"} 5</span>
            </span>
          )}

          {greenValue === 0 && redValue === 0 && (
            <span>No dodge data available</span>
          )}
        </div>
      </Tooltip>
    </>
  );
};

export default PercentageBar;
