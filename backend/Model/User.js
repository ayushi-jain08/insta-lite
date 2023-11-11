const mongoose = require("mongoose");
const bycrpyt = require("bcrypt")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: [true, "email already exists"],
  },
  work: {
    type: String,
    required: true,
  },
  worksAt: String,
  status: String,
  livesIn: String,
  study: String,

  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [6, "password must be at least 6 characters"],
  },
  profilePic: {
    type: String,
    required: true,
  },
  coverPic: {
    type: String,
    required: true,
  },
  posts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
  ],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

  ], 
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
  ]
},{timestamps:true});


UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
      this.password = await bycrpyt.hash(this.password,10)
    }
    next()
  })
const User= mongoose.model("User", UserSchema)

module.exports = User