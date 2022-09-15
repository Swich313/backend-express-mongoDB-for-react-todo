const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');


router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch(err){
        res.json({message: err});
    }
});

router.post('/', async (req, res) => {
    const todo = new Todo({
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        type: req.body.type,
        completed: req.body.completed,
        archived: req.body.archived
    });
    try {
        const savedTodo = await todo.save();
        res.json(savedTodo);
    } catch(err) {
        res.json({message: err});
    }
});

router.get('/:todoId', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.todoId);
        res.json(todo);
    } catch(err){
        res.json({message: err});
    }
});

router.delete('/:todoId', async (req, res) => {
    try {
        const deletedTodo = await Todo.remove({id: req.params.todoId});
        res.json(deletedTodo);
    } catch (err){
        res.json({message: err});
    }
});

router.patch('/:todoId', async (req, res) => {
    try {
        const updatedTodo = await Todo.updateOne(
            {id: req.params.todoId},
            { $set: {
                    title: req.body.title,
                    description: req.body.description,
                    deadline: req.body.deadline,
                    type: req.body.type,
                    completed: req.body.completed,
                    archived: req.body.archived
                }});
        res.json(updatedTodo);
    } catch (err){
        res.json({message: err});
    }
});

module.exports = router;