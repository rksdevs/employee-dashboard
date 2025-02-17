import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLScalarType,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLEnumType,
} from "graphql";
import Employee from "../models/EmployeeModel.js";
import User from "../models/userModel.js";
import { loginUser } from "../mutations/loginUser.js";
import { registerUser } from "../mutations/registerUser.js";
import { logoutUser } from "../mutations/logoutUser.js";
import { getUserRole } from "../queries/userRoleQuery.js";

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

// Address Type (Nested inside Employee)
const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

// Create Input Types for Address & Attendance
const AttendanceInputType = new GraphQLInputObjectType({
  name: "AttendanceInput",
  fields: () => ({
    date: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(AttendanceStatusEnum) },
  }),
});

const AddressInputType = new GraphQLInputObjectType({
  name: "AddressInput",
  fields: () => ({
    street: { type: GraphQLNonNull(GraphQLString) },
    city: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    zip: { type: GraphQLNonNull(GraphQLString) },
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

// User Type
const UserType = new GraphQLObjectType({
  name: "UserAdd",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve(parent) {
        return parent._id.toString();
      },
    },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
  }),
});

//Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    allEmployees: {
      type: new GraphQLList(EmployeeType),
      resolve() {
        return Employee.find({});
      },
    },
    employee: {
      type: EmployeeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Employee.findById(args.id);
      },
    },
    getUserRole,
  },
});

//Mutation
const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addEmployee: {
      type: EmployeeType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        class: { type: GraphQLNonNull(GraphQLString) },
        subjects: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
        attendance: {
          type: GraphQLNonNull(new GraphQLList(AttendanceInputType)),
        },
        address: { type: GraphQLNonNull(AddressInputType) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        isAdmin: { type: GraphQLNonNull(GraphQLBoolean), defaultValue: false },
      },
      async resolve(parent, args) {
        try {
          const employee = new Employee({
            name: args.name,
            email: args.email,
            class: args.class,
            subjects: args.subjects,
            attendance: args.attendance,
            address: args.address,
            age: args.age,
            isAdmin: args.isAdmin,
          });
          return await employee.save();
        } catch (error) {
          throw new Error(`Error creating new employee: ${error.message}`);
        }
      },
    },
    deleteEmployee: {
      type: EmployeeType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args, { res }) {
        if (res.user || res.user.isAdmin) {
          throw new Error("Not authorized to delete employees");
        }
        return Employee.findByIdAndDelete(args.id);
      },
    },
    updateEmployee: {
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
      async resolve(parent, args, { res }) {
        try {
          if (res.user || res.user.isAdmin) {
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
    },
    registerUser,
    loginUser,
    logoutUser,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
