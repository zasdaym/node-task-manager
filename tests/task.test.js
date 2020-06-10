const request = require('supertest');
const {app} = require('../src/app');
const {Task} = require('../src/models/task');
const {userOne, userOneId, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', () => {

});
