import "dotenv/config";
import express from "express";
import routes from "./routes";
import cors from "cors";
import sequelize from "../sequelize/db";
import "../models/experiences";
import "../models/repository";
import "../models/icon";
import "../models/repository-icons";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(routes);

async function startServer() {
  try {
    sequelize.sync().then(() => {
      app.listen(3000, () => console.log("Local server running"));
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
