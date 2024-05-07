import React from "react";
import AchievementsView from ".";
import AchievementsService from "./Index.service";

const Achievements = (props) => {
  return (
    <AchievementsService {...props}>
      {(serviceProps) => <AchievementsView {...serviceProps} />}
    </AchievementsService>
  );
};

export default Achievements;
