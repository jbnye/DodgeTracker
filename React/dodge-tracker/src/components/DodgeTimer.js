import { useState, useEffect } from "react";
export default function DodgeTimer({ socket, region }) {
  const [lastCheckedTime, setLastCheckedTime] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  useEffect(() => {
    if (!socket) return;

    const handleLastChecked = (checkedRegion) => {
      console.log(`Timer reset for ${region}`);
      if (checkedRegion === region) {
        setLastCheckedTime(0);
        startFlash();
      }
    };

    socket.on("last-checked", handleLastChecked);

    return () => {
      socket.off("last-checked", handleLastChecked);
    };
  }, [socket, region]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastCheckedTime((prev) => {
        const newTime = prev + 0.1;
        return Number(newTime.toFixed(1)); // Prevent floating point errors
      });
    }, 100);
    return () => clearInterval(intervalId); // Cleanup
  });

  const startFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      Last Dodge Check:
      <div
        style={{
          backgroundColor: isFlashing ? "#4CAF50" : "#041c1f",
          minWidth: "80px",
          borderRadius: "6px",
        }}
      >
        {lastCheckedTime}s
      </div>
    </div>
  );
}
