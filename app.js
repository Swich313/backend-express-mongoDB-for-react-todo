const express = require('express');
const mongoose = require('mongoose');
const app  = express();
const todosRoute = require('./routes/todos');
const filtersRoute= require('./routes/filters');
const authRoute = require('./routes/auth');
const bodyParser = require('body-parser');

require('dotenv/config');
const cors = require('cors');
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', todosRoute);
app.use('/filters', filtersRoute);
app.use('/api/user', authRoute);

app.get('/', (req, res) => {
    res.json('Hello from express');
});

mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('Connected to the mongoDB');
});

app.listen(PORT, () => {
    console.log(`Server in running on port ${PORT}`);
});