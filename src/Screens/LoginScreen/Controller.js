import React from "react";
import LoginBusinessLogic from "./Logic";
import LoginView from "./View";

const LoginScreen = (props) => {
  return (
    <LoginBusinessLogic {...props}>
      {(serviceProps) => <LoginView {...serviceProps} />}
    </LoginBusinessLogic>
  );
};

export default LoginScreen;
