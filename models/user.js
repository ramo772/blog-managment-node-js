const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    validate: {
      validator: function (value) {
        return value.length >= 5 && value.length <= 50;
      },
      message: 'Name must be at least 5 characters long and at most 50 characters long.',
    }
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: 'Invalid email format.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum length
    maxlength: 1024,
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);
      },
      message: 'Password must be at least 8 characters long and include both letters and numbers.'
    }
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);



exports.User = User; 