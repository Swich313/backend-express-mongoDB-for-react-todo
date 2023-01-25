const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const User = require('../models/User');
const Todo =  require('../models/Todo');

exports.getTodos = async (req, res, next) => {
    const currentPage = +req.query.page || 1;
    const sortType = req.query.sort || -1;
    const perPage = +req.query.limit || 4;
    const todoTypeFilter = req.query.filter;
    const filterObject = todoTypeFilter ? {todoType: todoTypeFilter} : null;
    console.log(filterObject)
    try {
        let totalItems = await Todo.find({userId: req.userId, ...filterObject}).countDocuments();
        const todos = await Todo.find({userId: req.userId, ...filterObject})
            // .populate('userId') if needs whole user object
            .sort({createdAt: sortType})
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

exports.deleteTodo = async (req, res, next) => {
    const todoId = req.params.todoId;
    console.log(todoId)
    try {
        const todo = await Todo.findById(todoId).populate('userId');
        if(!todo){
            const error = new Error('Could not find todo!');
            error.statusCode = 404;
            throw error;
        }
        if(todo.userId._id.toString() !== req.userId){
            const error = new Error('Not Authorized!');
            error.statusCode = 403;
            throw error;
        }
        if(!todo.isCompleted || !todo.isArchived){
            const error = new Error('You can\'t delete this todo. Todo is not completed or archived!');
            error.statusCode = 409;
            throw error;
        }
        await Todo.findByIdAndRemove(todoId);
        console.log(todo)
        const user = await User.findById(req.userId);
        user.todos.pull(todoId);
        await user.save();
        res.status(200).json({message: 'Todo was successfully deleted!'});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateTodo = async (req, res, next) => {
    const todoId = req.params.todoId;
    const isCompleted = req.body.isCompleted;
    const isArchived = req.body.isArchived;
    try {
        const todo = await Todo.findById(todoId);
        if(!todo){
            const error = new Error('Could not find todo!');
            error.statusCode = 404;
            throw error;
        }
        if(todo.userId.toString() !== req.userId){
            const error = new Error('Not Authorized!');
            error.statusCode = 403;
            throw error;
        }
        if(typeof isCompleted === 'boolean') {
            todo.isCompleted = isCompleted;
        }
        if(typeof isArchived === 'boolean') {
            todo.isArchived = isArchived;
        }
        const savedTodo =  await todo.save();
        res.status(200).json({message: 'Todo was successfully updated!', todo: savedTodo._doc});

    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

