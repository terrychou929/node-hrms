const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema (for login)
const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updated_at field
UserSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create models
const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
};