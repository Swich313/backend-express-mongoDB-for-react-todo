const express = require('express');
const {body} = require('express-validator');

const isAuth = require('../middleware/isAuth');
const todoController = require('../controllers/todo');

const router = express.Router();

//GET /todos?pag=+e=2&limit=4&sort1 (by default page=1, limit=2, sort=-1)
router.get('/',  isAuth, todoController.getTodos);

//GET /todos/filters
router.get('/filters', todoController.getFilters);

//POST /todos/filter
router.post('/filter',[
    body('todoType', 'Please enter a valid todo type! From 2 to 20 characters.')
        .trim()
        .isLength({min: 2, max: 20}),
], isAuth, todoController.createFilter);

//POST /todos/todo
router.post('/todo', [
    body('title', 'Please enter a valid title! From 5 to 100 characters.')
        .trim()
        .isLength({min: 5, max: 100}),
    body('description', 'Please enter a valid description! From 5 to 256 characters.')
        .trim()
        .isLength({min: 10, max: 256}),
    body('deadline', 'Invalid date')
], isAuth, todoController.createTodo);

//DELETE /todos/todo/:todoId
router.delete('/todo/:todoId', isAuth, todoController.deleteTodo);

//PATCH /todos/todo/:todoId
router.patch('/todo/:todoId', isAuth, todoController.updateTodo);



module.exports = router;