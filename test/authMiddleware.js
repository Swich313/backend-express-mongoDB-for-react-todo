const {expect} = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/isAuth');

describe('Auth Middleware', function() {

    it('should throw an error if no authorization header is present', function() {
        const req = {
            get: function() {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated! (No Header)');
    });

    it('should throw an error if the authorization header is only one string', function() {
        const req = {
            get: function() {
                return 'some_string';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should yield userId after decoding the token', function() {
        const req = {
            get: function() {
                return 'Bearer some_string';
            }
        };
        // jwt.verify = function() {               //globally replace jwt.verify() with my own method
        //     return {userId: 'some_id'}          //throughout authMiddlewave
        // };
        const stub = sinon.stub(jwt, 'verify');
        stub.returns({userId: 'some_id'});
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'some_id');
        expect(stub.called).to.be.true;

        stub.restore();
    });

    it('should throw an error if the token cannot be verified', function() {
        const req = {
            get: function() {
                return 'Bearer some_string';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });
})

