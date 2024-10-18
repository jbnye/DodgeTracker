import React from "react";
import DodgeItem from "./DodgeItem.js";

const DodgeList = ({ items }) => {
  return (
    <div className="dodge-list mx-15">
      {items.map((item, index) => (
        <DodgeItem
          key={index}
          image={item.image}
          name={item.name}
          rankImage={item.rankImage}
          lp={item.lp}
          dodgeAmount={item.dodgeAmount}
          timeDifference={item.timeDifference}
          className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
        />
      ))}
    </div>
  );
};

export default DodgeList;
