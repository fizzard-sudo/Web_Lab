const mongoose = require('mongoose');

// Define a Mongoose Schema and Model
// We will create a simple 'Author' model
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  birthYear: {
    type: Number,
    required: false
  }
});

module.exports = mongoose.model('Author', authorSchema);
