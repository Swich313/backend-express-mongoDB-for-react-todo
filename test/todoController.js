const {expect} = require('chai');
const mongoose = require('mongoose');
require('dotenv/config');

const User = require('../models/User');
const TodoController = require('../controllers/todo');

describe('Todo Controller - CreateTodo', function (){
    before(function(done){
        mongoose.connect(process.env.DB_CONNECTION_TEST)
            .then(result => {
                const user = new User({
                    _id: '63f31c53959689018c7a44fa',
                    email: 'test@test.com',
                    password: 'tester',
                    todos: []
                });
                return user.save()
            }).then(() => {
            done();
        })
    })
    it('should add a created todo to the todos of the user', function(done) {
        const req = {
            body: {
                title: 'Test Todo',
                description: 'Description of test todo',
                todoType: 'hobby'
            },
            userId: '63f31c53959689018c7a44fa'
        };

        const res = {status: function(){
            return this;
            }, json: function() {}};

        TodoController.createTodo(req, res, () => {}).then(savedUser => {
            // console.log(savedUser);
            expect(savedUser).to.have.property('todos');
            expect(savedUser.todos).to.have.length(1);
        }).then(done, done);

    });
    after(function(done){
        User.deleteMany({}).then(() => {
            return mongoose.disconnect()
        }).then(done, done)
    })
})
