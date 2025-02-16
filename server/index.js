import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
import colors from "colors";
import connectToDb from "./config/db.js";

const port = process.env.PORT || 5000;
const app = express();

connectToDb();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server is running on port ${port}`));
