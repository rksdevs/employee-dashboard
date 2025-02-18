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
import { addEmployee } from "../mutations/addEmployee.js";
import { updateEmployee } from "../mutations/updateEmployee.js";
import { deleteEmployee } from "../mutations/deleteEmployee.js";
import employeeQueries from "../queries/employeeQueries.js";

//Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...employeeQueries,
    getUserRole,
  },
});

//Mutation
const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addEmployee,
    deleteEmployee,
    updateEmployee,
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
