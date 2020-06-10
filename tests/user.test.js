const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {app} = require('../src/app');
const {User} = require('../src/models/user');
const {userOne, userOneId, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const response = await request(app).post('/users/signup').send({
    name: 'Test1',
    email: 'test1@example.com',
    password: 'P@ssw0rd',
    age: 20,
  }).expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: 'Test1',
      email: 'test1@example.com',
      age: 20,
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('P@ssw0rd');
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password,
  }).expect(200);

  const user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login non-existing users', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'wkwk',
  }).expect(400);
});

test('Should get user profile', async () => {
  await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
      .get('/users/me')
      .send()
      .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
      .delete('/users/me')
      .send()
      .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/profile-pic.jpg')
      .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  const response = await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'New',
      })
      .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe(response.body.name);
});

test('Should not update invalid user fields', async () => {
  await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'New York',
      })
      .expect(400);
});
