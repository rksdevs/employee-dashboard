import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} from "graphql";
import User from "../models/userModel.js";

const UserType = new GraphQLObjectType({
  name: "UserRegister",
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

const registerUser = {
  type: UserType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    isAdmin: { type: GraphQLNonNull(GraphQLBoolean) },
  },
  async resolve(parent, args, { res }) {
    try {
      const userExist = await User.findOne({ email: args.email });
      if (userExist) {
        throw new Error("User already exists, please login!");
      }

      const user = new User({
        name: args.name,
        email: args.email,
        password: args.password,
        isAdmin: args.isAdmin || false,
      });
      return await user.save();
    } catch (error) {
      throw new Error(`Unable to add new user: ${error.message}`);
    }
  },
};

export { registerUser };
