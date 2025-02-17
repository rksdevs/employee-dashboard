const { gql } = require("@apollo/client");

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      message
    }
  }
`;
