import React from "react";
import LoansBusinessLogic from "./Logic";
import LoansView from "./View";

const Loans = (props) => {
  return (
    <LoansBusinessLogic {...props}>
      {(serviceProps) => <LoansView {...serviceProps} />}
    </LoansBusinessLogic>
  );
};

export default Loans;
