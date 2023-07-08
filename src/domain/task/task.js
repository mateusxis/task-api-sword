const { attributes } = require('structure');

const Task = attributes({
  id: Number,
  summary: {
    type: String,
    maxLength: 2500
  },
  userId: {
    type: Number,
    required: true
  },
  executedAt: Date,
  createdAt: Date
})(class Task {});

module.exports = Task;
