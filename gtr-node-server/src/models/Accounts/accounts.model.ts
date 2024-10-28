import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";

const AccountSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
    required: false
  },
  emailConfirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  dialCode: {
    type: String,
    required: false,
    default: "",
  },
  countryCode: {
    type: String,
    required: false,
    default: "GH",
  },
  phone: {
    type: String,
    required: false,
    default: "",
    unique: true
  },
  phoneConfirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  acceptedTerms: {
    type: Boolean,
    required: false,
    default: false,
  },
  role: {
    type: String,
    required: false,
    default: "USER",
    enum: ["ADMIN", "USER"]
  },
  active: {
    type: Boolean,
    required: false,
    default: true,
  },
  createdAt: {
    type: Date,
    default: null,
    required: true,
  }
});


const Accounts = mongoose.model("accounts", AccountSchema);
export default Accounts;
