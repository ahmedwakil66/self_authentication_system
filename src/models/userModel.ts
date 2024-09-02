import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "../config/jwt";

export enum UserRole {
  User = "user",
  Admin = "admin",
}

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  name: string;
  email: string;
  password: string;
  refreshToken: string | null;
  isVerified: boolean;
  role: string[];
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateEmailVerificationToken(): string;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function () {
        return this.email.toLocaleLowerCase() === this.email;
      },
      message: 'Email must be all lowercase'
    },
  },
  password: {
    type: String,
    required: true,
    min: [6, "Passwords should be at least 6 characters"],
    max: [20, "Password should not exceed 20 characters"],
  },
  refreshToken: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  role: {
    type: [String],
    enum: Object.values(UserRole),
    default: ["user"],
  },
});

// 2.1 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as NativeError);
  }
});

// 2.2 Hash password before updating
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { password?: string };
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error as NativeError);
    }
  }
  next();
});

// 2.3 Add methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jsonwebtoken.generateAccessToken({
    id: this._id.toString(),
    email: this.email,
    role: this.role,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jsonwebtoken.generateRefreshToken({
    id: this._id.toString(),
    email: this.email,
  });
};

userSchema.methods.generateEmailVerificationToken = function () {
  return jsonwebtoken.generateEmailToken({
    id: this._id.toString(),
    email: this.email,
  });
};

// 3. Create a Model.
const User = mongoose.model("User", userSchema);

// 4. Export the User model
export default User;
