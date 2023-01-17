const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Todo =  require('../models/Todo');

exports.getTodos = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        let totalItems = await Todo.find().countDocuments();
        const todos = await Todo.find()
            // .populate('userId') if needs whole user object
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res.status(200).json({
            message: 'Todos fetched successfully!',
            todos: todos,
            totalItems: totalItems
        });
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.createTodo = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        const error = new Error('Validation failed, entered data is incorrect!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const title = req.body.title;
    const description = req.body.description;
    const todoType = req.body.todoType;
    const isCompleted = req.body.isCompleted;
    const isArchived = req.body.isArchived;
    const deadline = req.body.deadline;
    const todo = new Todo({
        title: title,
        description: description,
        todoType: todoType,
        deadline: deadline,
        isCompleted: isCompleted,
        isArchived: isArchived,
        userId: req.userId
    });
    try {
        await todo.save();
        const user = await User.findById(req.userId);
        user.todos.push(todo);
        await user.save();
        console.log(todo);
        res.status(201).json({
            message: 'Post created successfully!',
            todo: todo
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

