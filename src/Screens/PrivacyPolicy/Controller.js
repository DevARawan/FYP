import React from "react";
import PrivacyPolicyBusinessLogic from "./Logic";
import PrivacyPolicyView from "./View";

const PrivacyPolicy = (props) => {
  return (
    <PrivacyPolicyBusinessLogic {...props}>
      {(serviceProps) => <PrivacyPolicyView {...serviceProps} />}
    </PrivacyPolicyBusinessLogic>
  );
};

export default PrivacyPolicy;
