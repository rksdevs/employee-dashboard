import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
import colors from "colors";
import connectToDb from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./models/userModel.js";
import jwt from "jsonwebtoken";
import authMiddleware from "./middlewares/authMiddleware.js";
import path from "path";

const port = process.env.PORT || 5000;
const app = express();

connectToDb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      "https://employee-dashboard-zl0x.onrender.com/" ||
      "http://localhost:3000",
    credentials: true,
  })
);
app.use(authMiddleware);
const __dirname = path.resolve();

app.get("/api/me", async (req, res) => {
  try {
    // Get the token from cookies
    const token = req.cookies.authToken;
    if (!token) {
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "No token found" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // Exclude password
    if (!user) {
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "User not found" });
    }

    res.json({ isAuthenticated: true, user });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false, message: "Invalid token" });
  }
});

app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    graphiql: process.env.NODE_ENV === "development",
    context: { req, res }, // Pass `req` with `user` to GraphQL resolvers
  }))
);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app build
  app.use(express.static(path.join(__dirname, "/client/build")));

  // For any route not handled by our API, serve the React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.listen(port, () => console.log(`Server is running on port ${port}`));
