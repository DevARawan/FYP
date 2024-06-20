import React from "react";
import FinancialReportsBusinessLogic from "./Logic";
import FinancialReportsView from "./View";

const FinancialReports = (props) => {
  return (
    <FinancialReportsBusinessLogic {...props}>
      {(serviceProps) => <FinancialReportsView {...serviceProps} />}
    </FinancialReportsBusinessLogic>
  );
};

export default FinancialReports;
