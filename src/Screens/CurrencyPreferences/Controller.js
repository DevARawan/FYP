import React from "react";
import CurrencyPreferencesBusinessLogic from "./Logic";
import CurrencyPreferencesView from "./View";

const CurrencyPreferences = (props) => {
  return (
    <CurrencyPreferencesBusinessLogic {...props}>
      {(serviceProps) => <CurrencyPreferencesView {...serviceProps} />}
    </CurrencyPreferencesBusinessLogic>
  );
};

export default CurrencyPreferences;
