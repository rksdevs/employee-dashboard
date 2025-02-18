import { gql } from "@apollo/client";

export const DELETE_EMP = gql`
  mutation DELETEEMPLOYEE($id: ID!) {
    deleteEmployee(id: $id) {
      name
    }
  }
`;
