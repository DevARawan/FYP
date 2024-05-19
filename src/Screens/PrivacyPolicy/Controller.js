import React from "react";
import CurrencyPreferencesBusinessLogic from "./Logic";
import CurrencyPreferencesView from "./View";
import PrivacyPolictyBusinessLogic from "./Logic";
import PrivacyPolictyView from "./View";

const PrivacyPolicty = (props) => {
  return (
    <PrivacyPolictyBusinessLogic {...props}>
      {(serviceProps) => <PrivacyPolictyView {...serviceProps} />}
    </PrivacyPolictyBusinessLogic>
  );
};

export default PrivacyPolicty;
