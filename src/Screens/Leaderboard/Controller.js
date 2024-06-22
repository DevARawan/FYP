import React from "react";
import LeaderboardBusinessLogic from "./Logic";
import LeaderboardView from "./View";

const LeaderboardScreen = (props) => {
  return (
    <LeaderboardBusinessLogic {...props}>
      {(serviceProps) => <LeaderboardView {...serviceProps} />}
    </LeaderboardBusinessLogic>
  );
};

export default LeaderboardScreen;
