const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to DB!'))

//Import routes
const authRoute = require('./Routes/authentication');

//MidleWare
app.use(express.json());

//Routes middleware
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server up and running'));