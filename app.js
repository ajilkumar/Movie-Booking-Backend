import express from "express";
import cors from "cors";
import { HOST, PORT, CLIENT_ORIGIN } from "./src/config/env.js";
import connectToMongoDB from "./src/database/mongodb.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, HOST || "localhost", () => {
  console.log(`Server running at http://${HOST || "localhost"}:${PORT}`);
  connectToMongoDB();
});
