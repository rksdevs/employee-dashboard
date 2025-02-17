const { gql } = require("@apollo/client");

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $name: String!
    $isAdmin: Boolean!
  ) {
    registerUser(
      email: $email
      password: $password
      name: $name
      isAdmin: $isAdmin
    ) {
      name
      email
    }
  }
`;
