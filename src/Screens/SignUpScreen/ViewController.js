import React from 'react';
import SignUpBusinessLogic from './BusinessLogic';
import SignupView from './View';

const SignUpScreen = props => {
  return (
    <SignUpBusinessLogic {...props}>
      {serviceProps => <SignupView {...serviceProps} />}
    </SignUpBusinessLogic>
  );
};

export default SignUpScreen;
