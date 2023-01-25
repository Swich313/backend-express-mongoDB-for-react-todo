const express = require('express');
const {body} = require('express-validator');

const isAuth = require('../middleware/isAuth');
const todoController = require('../controllers/todo');
const Todo = require('../models/Todo');
const User = require('../models/User');

const router = express.Router();

//GET /todos?page=2&limit=4&sort=+1 (by default page=1, limit=2, sort=-1)
router.get('/',  isAuth, todoController.getTodos);

//POST /todos/todo
router.post('/todo', [
    body('title', 'Please enter a valid title! From 5 to 100 characters.')
        .trim()
        .isLength({min: 5, max: 100}),
    body('description', 'Please enter a valid description! From 5 to 256 characters.')
        .trim()
        .isLength({min: 5, max: 256}),
    body('deadline', 'Invalid date')
], isAuth, todoController.createTodo);

//DELETE /todos/todo/:todoId
router.delete('/todo/:todoId', isAuth, todoController.deleteTodo);

//PATCH /todos/todo/:todoId
router.patch('/todo/:todoId', isAuth, todoController.updateTodo);

// router.post('/', async (req, res) => {
//     const todo = new Todo({
//         id: req.body.id,
//         title: req.body.title,
//         description: req.body.description,
//         type: req.body.type,
//         completed: req.body.completed,
//         archived: req.body.archived
//     });
//     console.log(todo);
//     try {
//         const savedTodo = await todo.save();
//             res.json(savedTodo);
//     } catch(err) {
//         res.json({message: err});
//     }
//
// });
//
// router.get('/:todoId', async (req, res) => {
//     try {
//         const todo = await Todo.findById(req.params.todoId);
//         res.json(todo);
//     } catch(err){
//         res.json({message: err});
//     }
//
// });
//
// router.delete('/:todoId', async (req, res) => {
//    try {
//        const deletedTodo = await Todo.remove({_id: req.params.todoId});
//        res.json(deletedTodo);
//    } catch (err){
//        res.json({message: err});
//    }
// });
//
// router.patch('/:todoId', async (req, res) => {
//     try {
//         const updatedTodo = await Todo.updateOne(
//         {_id: req.params.todoId},
//              { $set: {title: req.body.title,
//                       description: req.body.description,
//                       type: req.body.type,
//                       completed: req.body.completed,
//                       archived: req.body.archived
//         }});
//         res.json(updatedTodo);
//     } catch (err){
//         res.json({message: err});
//     }
// });

module.exports = router;