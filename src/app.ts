import express from "express";
import sequelize from "./database.js";
import usersRouter from "./routes/users.js";
import companiesRouter from "./routes/companies.js";
import groupsRouter from "./routes/groups.js";
import permissionsRouter from "./routes/permissions.js";
import productsRouter from "./routes/products.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Use the routers for different routes
app.use("/users", usersRouter);
app.use("/companies", companiesRouter);
app.use("/groups", groupsRouter);
app.use("/permissions", permissionsRouter);
app.use("/products", productsRouter);

const startServer = async () => {
  await sequelize.sync();
  app.listen(4008, () => {
    console.log("Server is running on http://localhost:4008");
  });
};

startServer();

export default app;
