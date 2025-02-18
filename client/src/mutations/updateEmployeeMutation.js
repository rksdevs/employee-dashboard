import { gql } from "@apollo/client";

export const UPDATE_EMPLOYEE = gql`
  mutation UPDATEEMPPLOYEE(
    $name: String!
    $email: String!
    $class: String!
    $subjects: [String!]!
    $attendance: [AttendanceUpdate]
    $address: AddressUpdate
    $age: Int!
    $isAdmin: Boolean!
    $id: ID!
  ) {
    updateEmployee(
      id: $id
      name: $name
      email: $email
      class: $class
      subjects: $subjects
      attendance: $attendance
      address: $address
      age: $age
      isAdmin: $isAdmin
    ) {
      id
      name
      email
      class
      subjects
      attendance {
        date
        status
      }
      address {
        street
        city
        zip
      }
      age
      isAdmin
    }
  }
`;
