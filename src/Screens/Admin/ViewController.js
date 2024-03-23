import React from 'react';
import SignUpBusinessLogic from './Service';
import SignupView from './View';
import AdminService from './Service';
import AdminView from './View';

const AdminScreen = props => {
  return (
    <AdminService {...props}>
      {serviceProps => <AdminView {...serviceProps} />}
    </AdminService>
  );
};

export default AdminScreen;