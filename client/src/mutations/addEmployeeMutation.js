import { gql } from "@apollo/client";

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $name: String!
    $email: String!
    $class: String!
    $subjects: [String!]!
    $attendance: [AttendanceInput]
    $address: AddressInput
    $age: Int!
    $isAdmin: Boolean!
  ) {
    addEmployee(
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
