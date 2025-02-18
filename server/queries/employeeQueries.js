import { GraphQLList, GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import Employee from "../models/EmployeeModel.js";
import {
  EmployeePaginationResponse,
  EmployeeType,
} from "../types/EmployeeType.js";

const employeeQueries = {
  allEmployees: {
    type: EmployeePaginationResponse,
    args: {
      limit: { type: GraphQLInt, defaultValue: 10 },
      offset: { type: GraphQLInt, defaultValue: 0 },
      sortBy: { type: GraphQLString, defaultValue: "a-z" },
    },
    async resolve(_, { limit, offset, sortBy }) {
      const totalCount = await Employee.countDocuments({});
      let sortOptions = { name: 1 };
      if (sortBy === "z-a") {
        sortOptions = { name: -1 };
      }
      const employees = await Employee.find({})
        .sort(sortOptions)
        .skip(offset)
        .limit(limit);

      return {
        employees,
        totalCount,
      };
    },
  },

  employee: {
    type: EmployeeType,
    args: { id: { type: GraphQLID } },
    resolve(_, { id }) {
      return Employee.findById(id);
    },
  },
};

export default employeeQueries;
