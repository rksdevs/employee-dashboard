import { GraphQLObjectType, GraphQLString } from "graphql";

const LogoutUserType = new GraphQLObjectType({
  name: "LogoutUser",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

const logoutUser = {
  type: LogoutUserType,
  async resolve(parent, args, { res }) {
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return { message: "Logged out successfully" };
  },
};

export { logoutUser };
