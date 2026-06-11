import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    //   index: true
    },
    fullName: {
      type: String,
      required: true,
    //   unique: true,
    //   lowercase: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String, //url cloudnary
      required: true
    },
    avatar: {
      type: String, //url cloudnary
    //   required: true
    },
    watchHistory:[
        {
            type:Schema.types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String,

    }


  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);