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
} from "graphql";
import Employee from "../models/EmployeeModel.js";

// Attendance Type
const AttendanceType = new GraphQLObjectType({
  name: "Attendance",
  fields: () => ({
    date: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(GraphQLString) },
  }),
});

// Address Type (Nested inside Employee)
const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    street: { type: GraphQLNonNull(GraphQLString) },
    city: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLNonNull(GraphQLString) },
    zip: { type: GraphQLNonNull(GraphQLString) },
  }),
});

// Create Input Types for Address & Attendance
const AttendanceInputType = new GraphQLInputObjectType({
  name: "AttendanceInput",
  fields: () => ({
    date: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLNonNull(GraphQLString) },
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
  }),
});

//query
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
  },
});

//mutation
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
          });
          return await employee.save();
        } catch (error) {
          throw new Error(`Error creating new employee: ${error.message}`);
        }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
