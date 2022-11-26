const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");

const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
