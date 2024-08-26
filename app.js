const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const morgan = require("morgan");

// const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const config = require("./config/config");
const swaggerOptions = require("./config/swagger");
const cryptoRoutes = require("./routes/cryptoRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const daoRoutes = require("./routes/daoRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const appRoutes = require("./routes/appRoutes");

const User = require("./models/userModel");
const DAO = require("./models/daoModel");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/cryptos", cryptoRoutes);
app.use("/notifications", notificationRoutes);
app.use("/daos", daoRoutes);
app.use("/users", userRoutes);
app.use("/waitlists", waitlistRoutes);
app.use("/app", appRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to server" });
});

const PORT = config.port || 3000;
mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("Successfully connected to database!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `API documentation available at ${config.serverUrl}/api-docs`
      );
    });
  })
  .catch((err) => console.log(err));
