const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' } // added reference to Cart
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
