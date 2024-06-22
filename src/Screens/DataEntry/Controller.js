import React from "react";
import DataEntryBusinessLogic from "./Logic";
import DataEntryView from "./View";

const DataEntry = (props) => {
  return (
    <DataEntryBusinessLogic {...props}>
      {(serviceProps) => <DataEntryView {...serviceProps} />}
    </DataEntryBusinessLogic>
  );
};

export default DataEntry;
