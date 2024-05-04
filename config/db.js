const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.mongoURI)
.then(() => console.log('Successfully connected to database!'))
.catch(err => console.log(err));
