import React from "react";
import CurrencyPreferencesBusinessLogic from "./Logic";
import CurrencyPreferencesView from "./View";

const FinancialReports = (props) => {
  return (
    <CurrencyPreferencesBusinessLogic {...props}>
      {(serviceProps) => <CurrencyPreferencesView {...serviceProps} />}
    </CurrencyPreferencesBusinessLogic>
  );
};

export default FinancialReports;
