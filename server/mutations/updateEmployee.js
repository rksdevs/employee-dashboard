import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import Employee from "../models/EmployeeModel.js";

const AttendanceStatusEnum = new GraphQLEnumType({
  name: "EmployeeAttendanceUpdate",
  values: {
    PRESENT: { value: "Present" },
    ABSENT: { value: "Absent" },
    LEAVE: { value: "Leave" },
    WEEKOFF: { value: "Week Off" },
  },
});

// Attendance Type
const AttendanceType = new GraphQLObjectType({
  name: "AttendanceEnumUpdate",
  fields: () => ({
    date: { type: GraphQLString },
    status: { type: AttendanceStatusEnum },
  }),
});

// Address Type (Nested inside Employee)
const AddressType = new GraphQLObjectType({
  name: "AddressForEmployee",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
  name: "EmployeeUpdate",
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

const AddressUpdateType = new GraphQLInputObjectType({
  name: "AddressUpdate",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

// Create Input Types for Address & Attendance
const AttendanceUpdateType = new GraphQLInputObjectType({
  name: "AttendanceUpdate",
  fields: () => ({
    date: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(AttendanceStatusEnum) },
  }),
});

const updateEmployee = {
  type: EmployeeType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    class: { type: GraphQLString },
    age: { type: GraphQLInt },
    subjects: { type: new GraphQLList(GraphQLString) },
    attendance: {
      type: new GraphQLList(AttendanceUpdateType),
    },
    address: { type: AddressUpdateType },
    isAdmin: { type: GraphQLBoolean },
  },
  async resolve(parent, args, context) {
    try {
      if (!context.res.req.user.isAdmin) {
        throw new Error("Not authorized to update employees");
      }
      return await Employee.findByIdAndUpdate(
        args.id,
        {
          $set: {
            name: args.name,
            email: args.email,
            class: args.class,
            age: args.age,
            subjects: args.subjects,
            attendance: args.attendance,
            address: args.address,
            isAdmin: args.isAdmin,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating employee: ${error.message}`);
    }
  },
};

export { updateEmployee };
