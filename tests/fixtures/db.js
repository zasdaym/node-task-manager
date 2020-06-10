const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'User1',
  email: 'user1@example.com',
  password: 'P@ssw0rd',
  tokens: [{
    token: jwt.sign({
      _id: userOneId,
    }, process.env.JWT_SECRET),
  }],
};

const setupDatabase = async () => {	
  beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
  });
};

module.export = {
  userOne,
  userOneId,
  setupDatabase,
}
