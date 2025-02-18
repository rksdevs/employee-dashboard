import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType,
} from "graphql";

// Attendance Enum Type
const AttendanceStatusEnum = new GraphQLEnumType({
  name: "EmployeeAttendance",
  values: {
    PRESENT: { value: "Present" },
    ABSENT: { value: "Absent" },
    LEAVE: { value: "Leave" },
    WEEKOFF: { value: "Week Off" },
  },
});

// Attendance Type
const AttendanceType = new GraphQLObjectType({
  name: "Attendance",
  fields: () => ({
    date: { type: GraphQLString },
    status: { type: AttendanceStatusEnum },
  }),
});

// Address Type
const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
  name: "Employee",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve(parent) {
        return parent._id.toString();
      },
    },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    class: { type: GraphQLString },
    subjects: { type: new GraphQLList(GraphQLString) },
    attendance: { type: new GraphQLList(AttendanceType) },
    address: { type: AddressType },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
  }),
});

const EmployeePaginationResponse = new GraphQLObjectType({
  name: "EmployeePaginationResponse",
  fields: () => ({
    employees: { type: new GraphQLList(EmployeeType) },
    totalCount: { type: GraphQLInt },
  }),
});

export {
  EmployeeType,
  AddressType,
  AttendanceType,
  EmployeePaginationResponse,
};
