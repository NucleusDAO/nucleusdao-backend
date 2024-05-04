const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const config = require('./config/config');
const swaggerOptions = require('./config/swagger');
require('./config/db');
require('./config/passport');
const proposalRoutes = require('./routes/proposalRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const daoRoutes = require('./routes/daoRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
const specs = swaggerJsdoc(swaggerOptions);

app.use('/proposals', proposalRoutes);
app.use('/cryptos', cryptoRoutes);
app.use('/notifications', notificationRoutes);
app.use('/daos', daoRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to server' });
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at ${config.serverUrl}/api-docs`);
});
