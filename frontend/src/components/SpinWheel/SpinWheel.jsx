import React, { useState, useContext } from "react";
import axios from "axios";
import "./SpinWheel.css";
import { StoreContext } from "../../context/StoreContext";

const rewardsList = [
  "Free Samosa",
  "20% Coffee Off",
  "Double Points",
  "Buy 1 Get 1",
  "Free Tea",
  "Better Luck"
];

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState(null);

  const { url, token } = useContext(StoreContext);

  const segmentAngle = 360 / rewardsList.length;

  const handleSpin = async () => {
    if (spinning) return;

    try {
      setSpinning(true);
      setReward(null);

      const res = await axios.post(
        `${url}/api/spin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const winReward = res.data?.reward?.name;
      if (!winReward) throw new Error("No reward returned");

      const index = rewardsList.findIndex(r => r === winReward);

      const stopAngle =
        360 - index * segmentAngle - segmentAngle / 2;

      const totalRotation = rotation + 360 * 6 + stopAngle;

      setRotation(totalRotation);

      setTimeout(() => {
        setReward(winReward);
        setSpinning(false);
      }, 5000);

    } catch (err) {
      alert(err.response?.data?.message || "Spin Failed");
      setSpinning(false);
    }
  };

  return (
    <div className="spin-container">

      <h2 className="spin-title">🎰 Daily Lucky Spin</h2>

      <div className="wheel-wrapper">

        <div className="pointer" />

        <div
          className={`wheel ${spinning ? "spinning" : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {rewardsList.map((item, i) => (
            <div
              key={i}
              className="segment"
              style={{
                transform: `rotate(${i * segmentAngle}deg) skewY(${90 - segmentAngle}deg)`
              }}
            >
              <span
                style={{
                  transform: `skewY(-${90 - segmentAngle}deg) rotate(${segmentAngle / 2}deg)`
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

      </div>

      <button
        className="spin-btn"
        onClick={handleSpin}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "SPIN NOW"}
      </button>

      {reward && (
        <div className="reward-popup">
          🎉 Congratulations! <br />
          You Won <b>{reward}</b>
        </div>
      )}

    </div>
  );
};

export default SpinWheel;

