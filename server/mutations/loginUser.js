import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Ensure correct path
import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} from "graphql";
import User from "../models/userModel.js";

const UserType = new GraphQLObjectType({
  name: "UserLogin",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve(parent) {
        return parent.id;
      },
    },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
  }),
});

const loginUser = {
  type: UserType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { res }) {
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set Cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },
};

export { loginUser };
