var request      = require('supertest'),
    express      = require('express'),
    mongoose     = require('mongoose');

var expect = require('chai').expect;
// var userController = require('../server/user/userController');

var routeHandler = require('../server/routeHandler');
var config = require('config');
mongoose.connect(config.get('mongo'));

var app = express();
var User = require('../server/user/userModel');
var TempUser = require('../server/user/tempUserModel');
var rand;
app.use(routeHandler);

describe('Local-Passport Specs', function() {

  before(function(done) {
    User.remove({}, function() {
      TempUser.remove({}, function() {
        console.log('local database cleared');
        done();
      })
    });
  });

  this.timeout(3000);

  describe('Signup Spec', function () {
    it('should signup a new user successfully', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'test', business_name: "Starbucks", email: 'azai91@gmail.com', password: 'hackreactor'})
        .expect(200)
        .end(function(err, res) {
          rand = res.body;
          done();
        });
    });

    it('should return error if attempting to signup with a used email', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'test', business_name: 'Starbucks', email: 'kirby8u@hotmail.com', password: 'hackreactor'})
        .expect(401, done);
    });
  });

  describe('Verify Spec', function() {
    it('should have success if verify true', function(done) {
      request(app)
        .post('/verify?id=' +rand)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.username).to.eql('test');
          done();
        })
        // .expect(200, done);
    });

    it('should redirect if verify hash is incorrect', function(done) {
      request(app)
        .get('/verify?id=' +0)
        .end(function(err, res) {
          expect(res.header['location']).to.eql('/')
          done();
        })
    });


  });

  describe('Login Spec', function() {
    it('should login into a current user successfully', function(done) {
      request(app)
        .post('/login')
        .send({ username: 'test', password: 'hackreactor'})
        .expect(200)
        .end(function(err, res) {
          expect(res.body.username).to.eql('test');
          done();
        })
    });


    it('should return error if attempting to login with incorrect password', function(done) {
      request(app)
        .post('/login')
        .send({ username: 'test', password: 'wrong'})
        .expect(401, done);
    });

  });

});