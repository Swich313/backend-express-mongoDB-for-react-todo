const express = require('express');
const mongoose = require('mongoose');
const app = express();
const todosRoute = require('./routes/todos');
const bodyParser = require('body-parser');
require('dotenv/config');
const cors = require('cors');
const PORT = 8000;

app.use(bodyParser.json());
app.use('/todos', todosRoute);
app.use(cors());



// const filtersRoute = require('./routes/filters');

// app.use('/filters', filtersRoute);

app.get('/', (req, res) => {
    res.send('Hello form express')
})

mongoose.connect(process.env.DB_CONNECTION1, () => {
    console.log('connected to DB')
});

app.listen(PORT, () => {
    console.log(`Server in running on port ${PORT}`)
});