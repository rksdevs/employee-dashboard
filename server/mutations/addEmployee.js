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

// Address Type (Nested inside Employee)
const AddressType = new GraphQLObjectType({
  name: "AddressAddEmployee",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

const AttendanceStatusEnum = new GraphQLEnumType({
  name: "EmployeeAttendanceAddEmployee",
  values: {
    PRESENT: { value: "Present" },
    ABSENT: { value: "Absent" },
    LEAVE: { value: "Leave" },
    WEEKOFF: { value: "Week Off" },
  },
});

// Attendance Type
const AttendanceType = new GraphQLObjectType({
  name: "AttendanceAddEmployee",
  fields: () => ({
    date: { type: GraphQLString },
    status: { type: AttendanceStatusEnum },
  }),
});

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
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

const EmployeeType = new GraphQLObjectType({
  name: "AddEmployee",
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

const addEmployee = {
  type: EmployeeType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    class: { type: GraphQLNonNull(GraphQLString) },
    subjects: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
    attendance: {
      type: new GraphQLList(AttendanceInputType),
    },
    address: { type: AddressInputType },
    age: { type: GraphQLNonNull(GraphQLInt) },
    isAdmin: { type: GraphQLNonNull(GraphQLBoolean), defaultValue: false },
  },
  async resolve(parent, args, context) {
    try {
      if (!context.res.req.user.isAdmin) {
        throw new Error("Not authorized to add employees");
      }
      const employee = new Employee({
        name: args.name,
        email: args.email,
        class: args.class,
        subjects: args.subjects,
        attendance: args.attendance || [],
        address: args.address || {},
        age: args.age,
        isAdmin: args.isAdmin,
      });
      return await employee.save();
    } catch (error) {
      throw new Error(`Error creating new employee: ${error.message}`);
    }
  },
};

export { addEmployee };
