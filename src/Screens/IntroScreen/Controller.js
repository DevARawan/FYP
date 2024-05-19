import React from "react";
import IntroBusinessLogic from "./Logic";
import IntroView from "./View";

const FrontScreen = (props) => {
  return (
    <IntroBusinessLogic {...props}>
      {(serviceProps) => <IntroView {...serviceProps} />}
    </IntroBusinessLogic>
  );
};

export default FrontScreen;
