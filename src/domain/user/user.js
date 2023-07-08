const { attributes } = require('structure');

const User = attributes({
  id: Number,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    email: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    equal: ['DEV', 'MANAGER'],
    default: 'DEV'
  },
  createdAt: Date
})(class User {});

module.exports = User;
