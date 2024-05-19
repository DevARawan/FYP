import React from "react";
import CurrencyPreferencesBusinessLogic from "./Logic";
import CurrencyPreferencesView from "./View";
import ExpenseReportsBusinessLogic from "./Logic";
import ExpenseReportsView from "./View";

const ExpenseReports = (props) => {
  return (
    <ExpenseReportsBusinessLogic {...props}>
      {(serviceProps) => <ExpenseReportsView {...serviceProps} />}
    </ExpenseReportsBusinessLogic>
  );
};

export default ExpenseReports;
