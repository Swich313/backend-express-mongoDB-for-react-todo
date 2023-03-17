const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

require('dotenv/config');

const todosRoutes = require('./routes/todo');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const hostname = '127.0.0.1';
app.use(cookieParser());



const fileStorage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uuidv4() + '-' + file.originalname);
    }
});
const fileFilter  = (req, file, cb) => {
    if(file.mimetype  === 'image/png' ||
       file.mimetype  === 'image/jpg' ||
       file.mimetype  === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     if(req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
    // methods: ['GET, POST, PUT, PATCH, DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    // origin: localhost:3000,
    // origin: 'http://127.0.0.1:5173/auth',
}))
app.use(multer({storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoutes);
app.use('/todos', todosRoutes);
app.use('/user', userRoutes);

app.use(errorMiddleware);
// app.use((error, req, res, next) => {
//     // console.log(error);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     const data = error.data;
//     res.status(status).json({message: message, data: data});
// });



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