import React from "react";
import DodgeItem from "./DodgeItem.js";

const DodgeList = ({ items }) => {
  return (
    <div className="dodge-list mx-20">
      {items.map((item, index) => (
        <DodgeItem
          key={index}
          image={item.image}
          name={item.name}
          rankImage={item.rankImage}
          lp={item.lp}
          dodgeAmount={item.dodgeAmount}
          timeDifference={item.timeDifference}
        />
      ))}
    </div>
  );
};

export default DodgeList;
