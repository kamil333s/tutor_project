'use strict';
process.env.MONGO_URI = 'mongodb://localhost:27017/s3-test';
require('../index');
let mongoose = require('mongoose');
let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
let request = chai.request;
let expect = chai.expect;
let models = require('../models');
let User = models.User;
let Table = models.Table;
let Subject = models.Subject;
let Session = models.Session;

var token;
var sessionsId;
var tablesId;
var subjectsId;
describe('RESTful API', function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  describe('Users route', function() {



    it('should be able to create a new user', function(done) {
      chai.request('localhost:3000')
        .post('/users')
        .send({name: 'mike', password: 'password'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('New user created');
          done();
        });
    });

    it('should be able to login a user', function(done) {
      chai.request('localhost:3000')
        .post('/login')
        .auth('mike', 'password')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          done();
        })
    })

  })

  describe('Sessions routes', function() {



    it ('should be able to create a session', function(done) {
      chai.request('localhost:3000')
        .post('/sessions')
        .send({table : "17", subject : "Algebra 1"})
        .end((err, res) => {
          sessionsId = res.body._id;
          expect(err).to.eql(null);
          expect(res.body).to.have.property('_id');
          done();
        })
    });

    it ('should be able to get sessions', function(done) {
      chai.request('localhost:3000')
        .get('/sessions')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        })
    });

    it ('should be able to update a session', function(done) {
      chai.request('localhost:3000')
        .put('/sessions/'+sessionsId)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Updated session');
          done();
        })
    });

    it ('should be able to delete a session', function(done) {
      chai.request('localhost:3000')
        .del('/sessions/'+sessionsId)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('session removed');
          done();
        })
    });

  })

  describe('Tables routes', function() {

    beforeEach((done) => {
      chai.request('localhost:3000')
        .post('/login')
        .auth('mike', 'password')
        .end((err, res) => {
          token = res.body.token;
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          done();
        })
    })



    it ('should create a list ', function(done) {
      chai.request('localhost:3000')
        .post('/admin/tables')
        .set('authorization', token)
        .send({tables: ['A7']})
        .end((err, res) => {
          // console.log(res.body);
          expect(err).to.eql(null);
          expect(res.body).to.have.property('_id');
          done();
        })
    });

    it ('should return an array table ', function(done) {
      chai.request('localhost:3000')
        .get('/admin/tables')
        .set('authorization', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        })
    });

  describe('Create a table Id', () => {

    beforeEach((done) => {
      chai.request('localhost:3000')
        .post('/admin/tables')
        .set('authorization', token)
        .send({tables: ['A8']})
        .end((err, res) => {
          tablesId = res.body._id;
          done();
        })
    })

    it ('should update a table ', function(done) {
      chai.request('localhost:3000')
        .put('/admin/tables/'+tablesId)
        .set('authorization', token)
        .send({tables: ['A7']})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Table updated');
          done();
        })
    });
  })


  //
  //   it ('should delete tables', function(done) {
  //     chai.request('localhost:3000')
  //       .del('/admin/tables')
  //       .end((err, res) => {
  //         expect(err).to.eql(null);
  //         expect(res.text).to.eql('Tables deleted!');
  //         done();
  //       })
  //   });
  //
  // })
  //
  // describe('Subjects routes', function() {
  //
  //   it ('should create a subject ', function(done) {
  //     chai.request('localhost:3000')
  //       .post('/admin/subjects')
  //       .send({subjects: 'Algebra'})
  //       .end((err, res) => {
  //         subjectsId = res.body._id;
  //         expect(err).to.eql(null);
  //         expect(res.body).to.have.property('subjects');
  //         done();
  //       })
  //   });
  //
  //   it ('should return an array of subjects ', function(done) {
  //     chai.request('localhost:3000')
  //       .get('/admin/subjects')
  //       .end((err, res) => {
  //         expect(err).to.eql(null);
  //         expect(Array.isArray(res.body)).to.eql(true);
  //         done();
  //       })
  //   });
  //
  //   it ('should update a subject ', function(done) {
  //     chai.request('localhost:3000')
  //       .put('/admin/subjects/'+subjectsId)
  //       .send({subjects: 'Statistics'})
  //       .end((err, res) => {
  //         expect(err).to.eql(null);
  //         expect(res.body.message).to.eql('Subject updated');
  //         done();
  //       })
  //   });
  //
  //   it ('should delete a subject ', function(done) {
  //     chai.request('localhost:3000')
  //       .del('/admin/subjects')
  //       .end((err, res) => {
  //         expect(err).to.eql(null);
  //         expect(res.text).to.eql('Subjects deleted!');
  //         done();
  //       })
  //   });
  //
  })

});
