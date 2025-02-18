import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
  query getAllEmployees($limit: Int, $offset: Int, $sortBy: String) {
    allEmployees(limit: $limit, offset: $offset, sortBy: $sortBy) {
      employees {
        id
        name
        class
      }
      totalCount
    }
  }
`;

export const GET_EMPLOYEE_DETAILS = gql`
  query getEmployeeDetails($id: ID!) {
    employee(id: $id) {
      id
      name
      class
      email
      isAdmin
      subjects
      address {
        street
        city
        state
        zip
      }
      attendance {
        date
        status
      }
      age
    }
  }
`;

export const GET_USER_ROLE = gql`
  query GetUserRole {
    isAdmin
  }
`;

export const GET_ME = gql`
  query GetMe {
    getUserRole {
      id
      name
      email
      isAdmin
    }
  }
`;
