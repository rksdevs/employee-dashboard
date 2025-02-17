const { gql } = require("@apollo/client");

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      name
      email
      isAdmin
    }
  }
`;
