const {expect} = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv/config');

const User = require('../models/User');
const AuthController = require('../controllers/auth');
const authService = require("../services/authService");

describe('Auth Controller - Login and getUserName', function (){
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
    it('should throw an error with code 500 if accessing the database fails', function(done) {
        const stub = sinon.stub(User, 'findOne');
        stub.throws();

        const req = {
            body: {
                email: 'test@test.com',
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);

        }).then(done, done);

        stub.restore();
    });

    it('should send a response with a valid userEmail for an existing user', function(done) {

                const req = {userId: '63f31c53959689018c7a44fa'};
                const res = {
                    statusCode: 500,
                    userEmail: null,
                    userName: null,
                    status: function (code){
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.userEmail = data.userEmail;
                        this.userName = data.userName;
                    }
                };
                AuthController.getUserName(req, res, () => {}).then((result) => {
                    console.log({status: res.statusCode, name: res.userName, email: res.userEmail})
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.userName).to.be.equal('User');
                    expect(res.userEmail).to.be.equal('test@test.com');
                    done();
                })

    });
    after(function(done){
        User.deleteMany({}).then(() => {
            return mongoose.disconnect()
        }).then(done, done)
    })
})
