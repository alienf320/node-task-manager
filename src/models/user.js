const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const Task = require('../models/task.js')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("No tengo idea de como funciona esto");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value === "password") {
        throw new Error("You can not use 'password' as your password");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Negative numbers are not allowed");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String
      }
    }
  ]
}, { timestamps: true });

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({_id: this._id}, 'asdfasdf')
  this.tokens.push({token})
  this.save();
  return token
}

userSchema.statics.findCredentials = async (email, password) => {
  const user = await User.findOne({email})
  if(!user) {
    throw new Error('That email is not registered')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    throw new Error('Password is incorrect')
  }

  return user
}

// Antes de almacenar el password, lo codifica
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 8);
  }
  next();
});

// Antes de eliminar un usuario, elimina todas sus tarea
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({owner: user._id})  
  next()
})

const User = mongoose.model("users", userSchema);

module.exports = User;
