import React from 'react';
import PropTypes from 'prop-types';

const AuthLayout = ({ children }) => {
  return <div>{children}</div>;
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;