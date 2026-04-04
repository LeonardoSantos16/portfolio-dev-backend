import "dotenv/config";
import "pg";
import express from "express";
import routes from "./routes";
import cors from "cors";
import sequelize from "../sequelize/db";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV !== "production") {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}

export default app;
