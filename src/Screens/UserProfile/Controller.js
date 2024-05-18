import React from "react";
import ProfileBusinessLogic from "./Logic";
import ProfileView from "./View";

const UserProfile = (props) => {
  return (
    <ProfileBusinessLogic {...props}>
      {(serviceProps) => <ProfileView {...serviceProps} />}
    </ProfileBusinessLogic>
  );
};

export default UserProfile;
