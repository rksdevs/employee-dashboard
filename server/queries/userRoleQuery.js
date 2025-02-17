import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from "graphql";

const UserType = new GraphQLObjectType({
  name: "UserRoleType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
  }),
});

const getUserRole = {
  type: UserType,
  async resolve(parent, args, { req }) {
    try {
      const token = req.cookies.authToken; // Get token from cookies
      if (!token) {
        throw new Error("Not authenticated");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    } catch (error) {
      throw new Error("Authentication failed");
    }
  },
};

export { getUserRole };
