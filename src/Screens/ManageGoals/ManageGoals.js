import React from "react";
import ManageGoalsView from ".";
import ManageGoalsService from "./Index.service";

const ManageGoals = (props) => {
  return (
    <ManageGoalsService {...props}>
      {(serviceProps) => <ManageGoalsView {...serviceProps} />}
    </ManageGoalsService>
  );
};

export default ManageGoals;
