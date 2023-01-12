const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');


const todosRoute = require('./routes/todos');
const authRoutes = require('./routes/auth');


const app = express();
const hostname = '127.0.0.1';

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/todos', todosRoute);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});



// const filtersRoute = require('./routes/filters');

// app.use('/filters', filtersRoute);

app.get('/', (req, res) => {
    res.send('Hello form express')
})
mongoose.connect(process.env.DB_CONNECTION)
    .then(result => {
        app.listen(process.env.PORT || 8000, hostname, () => {
            console.log(`Server in running at http://${hostname}:${process.env.PORT}`)
        });
    })
    .catch(err => console.log(err))