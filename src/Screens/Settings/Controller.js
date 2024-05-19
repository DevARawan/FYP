import React from "react";
import SettingsBusinessLogic from "./Logic";
import SettingsView from "./View";

const Settings = (props) => {
  return (
    <SettingsBusinessLogic {...props}>
      {(serviceProps) => <SettingsView {...serviceProps} />}
    </SettingsBusinessLogic>
  );
};

export default Settings;
