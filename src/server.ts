import "dotenv/config";
import "pg";
import app from "./app";
import sequelize from "../sequelize/db";

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}

export default app;
