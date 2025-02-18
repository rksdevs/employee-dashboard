import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import Employee from "../models/EmployeeModel.js";

const AttendanceStatusEnum = new GraphQLEnumType({
  name: "EmployeeAttendanceDelete",
  values: {
    PRESENT: { value: "Present" },
    ABSENT: { value: "Absent" },
    LEAVE: { value: "Leave" },
    WEEKOFF: { value: "Week Off" },
  },
});

// Attendance Type
const AttendanceType = new GraphQLObjectType({
  name: "AttendanceDelete",
  fields: () => ({
    date: { type: GraphQLString },
    status: { type: AttendanceStatusEnum },
  }),
});

// Address Type (Nested inside Employee)
const AddressType = new GraphQLObjectType({
  name: "AddressDelete",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
  name: "EmployeeDelete",
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

const deleteEmployee = {
  type: EmployeeType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, context) {
    try {
      if (!context.res.req.user.isAdmin) {
        throw new Error("Not authorized to update employees");
      }
      return Employee.findByIdAndDelete(args.id);
    } catch (error) {
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  },
};

export { deleteEmployee };
