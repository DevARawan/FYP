import React from "react";
import HomeScreenBusinessLogic from "./Logic";
import HomeScreenView from "./View";

const HomeScreen = (props) => {
  return (
    <HomeScreenBusinessLogic {...props}>
      {(serviceProps) => <HomeScreenView {...serviceProps} />}
    </HomeScreenBusinessLogic>
  );
};

export default HomeScreen;
