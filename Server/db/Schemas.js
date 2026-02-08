// // db/Schemas.js
// import bcrypt from "bcrypt";
// import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//   email: { type: String, required: [true,"Email is required"], unique: true, maxlength: 255 },
//   password: { type: String, required: [true, "Password is required"], maxlength: 255 },
//   name: { type: String, required: true, maxlength: 255 },
//   createdAt: { type: Date, default: Date.now, required: true },
//   phoneNumber: { type: String, required: false, maxlength: 255 },
//   address: { type: String, required: false, maxlength: 255 },
//   hobbies: { type: String, required: false, maxlength: 255 },
//   image: { type: String, required: false, maxlength: 255 }
// });

// // userSchema.pre("save", async function (next) {
// //     if (!this.isModified("password")) {
// //     return next();
// //   }
// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// //   // const salt = await bcrypt.genSalt();
// //   // this.password = await bcrypt.hash(this.password, salt);
// //   // next();
// // })

// const reportsSchema = mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   location: { type: String, required: true },
//   wasteType: { type: String, required: true, maxlength: 255 },
//   amount: { type: String, required: true, maxlength: 255 },
//   imageUrl: { type: String }, // User's reported image
//   verificationImage: { type: String }, // Collector's verification image
//   verificationResult: { type: Object }, // JSON object from AI for user report
//   collectorVerificationResult: { type: Object }, // JSON object from AI for collector verification
//   status: { type: String, required: true, default: "Pending", maxlength: 255 },
//   createdAt: { type: Date, default: Date.now, required: true, get: (v) => v instanceof Date ? v : new Date(v) },
//   collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   collectionDate: { type: Date },
// });

// const rewardSchema = mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   points: { type: Number, default: 0, required: true },
//   createdAt: { type: Date, default: Date.now, required: true },
//   updatedAt: { type: Date, default: Date.now, required: true },
//   isAvailable: { type: Boolean, default: true, required: true },
//   desc: { type: String },
//   name: { type: String, required: true, maxlength: 255 },
// });

// const notificationSchema = mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   message: { type: String, required: true },
//   isRead: { type: Boolean, default: false, required: true },
//   createdAt: { type: Date, default: Date.now, required: true },
// });

// const TransactionSchema = mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   type: { type: String, required: true, maxlength: 20 },
//   amount: { type: Number, required: true },
//   description: { type: String, required: true },
//   date: { type: Date, default: Date.now, required: true },
// });


// // This hook automatically hashes the password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await genSalt(10);
//   this.password = await hash(this.password, salt);
//   next();
// });

// export const User = mongoose.model("User", userSchema);
// export const Rewards = mongoose.model("Rewards", rewardSchema);
// export const Report = mongoose.model("Report", reportsSchema);
// export const Notifications = mongoose.model("Notifications", notificationSchema);
// export const Transaction = mongoose.model("Transaction", TransactionSchema);


// db/Schemas.js
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: [true,"Email is required"], unique: true, maxlength: 255 },
  password: { type: String, required: [true, "Password is required"], maxlength: 255 },
  name: { type: String, required: true, maxlength: 255 },
  createdAt: { type: Date, default: Date.now, required: true },
  phoneNumber: { type: String, required: false, maxlength: 255 },
  address: { type: String, required: false, maxlength: 255 },
  hobbies: { type: String, required: false, maxlength: 255 },
  image: { type: String, required: false, maxlength: 255 }
});

// This hook automatically hashes the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const reportsSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  wasteType: { type: String, required: true, maxlength: 255 },
  amount: { type: String, required: true, maxlength: 255 },
  imageUrl: { type: String }, // User's reported image
  verificationImage: { type: String }, // Collector's verification image
  verificationResult: { type: Object }, // JSON object from AI for user report
  collectorVerificationResult: { type: Object }, // JSON object from AI for collector verification
  status: { type: String, required: true, default: "Pending", maxlength: 255 },
  createdAt: { type: Date, default: Date.now, required: true, get: (v) => v instanceof Date ? v : new Date(v) },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collectionDate: { type: Date },
});

const rewardSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  isAvailable: { type: Boolean, default: true, required: true },
  desc: { type: String },
  name: { type: String, required: true, maxlength: 255 },
});

const notificationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

const TransactionSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, maxlength: 20 },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

export const User = mongoose.model("User", userSchema);
export const Rewards = mongoose.model("Rewards", rewardSchema);
export const Report = mongoose.model("Report", reportsSchema);
export const Notifications = mongoose.model("Notifications", notificationSchema);
export const Transaction = mongoose.model("Transaction", TransactionSchema);