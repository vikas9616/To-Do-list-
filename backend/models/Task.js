const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: String,
  status: String
});

module.exports = mongoose.model('Task', taskSchema);
