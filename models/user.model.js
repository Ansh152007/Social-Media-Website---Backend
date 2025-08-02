import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Please enter less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxLength: [18, "Password cannot exceed 18 characters"],
      minLength: [8, "Minimum 8 Characters are required"],
      select: false,
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    bio: {
      type: String,
      maxLength: [200, "Bio cannot exceed 200 characters"],
    },
    createdPins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pin",
      },
    ],
    createdBoards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//hashing the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //Hashing the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare password
userSchema.methods.comparePassword = async function (enterpassword) {
  if (enterpassword.length < 8 || enterpassword.length > 18) {
    console.log("Invalid password length!");
    return;
  }

  return await bcrypt.compare(enterpassword, this.password);
};

//Resetting the password
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 minutes

  return resetToken;
};

userSchema.virtual("totalpins").get(function () {
  return this.createdPins.length;
});

userSchema.virtual("totalboards").get(function () {
  return this.createdBoards.length;
});

const User = mongoose.model("User", userSchema);
export default User;
