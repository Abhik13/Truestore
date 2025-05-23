const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "validator"] },
  tokens: { type: Number, default: 1000 },
  registered_at: { type: Date, default: Date.now },
  account : {type : String ,default : "NULL" }, // changed schema for blockchain usage
  private_key : {type : String, default : "NULL"}
});

module.exports = mongoose.model("user", UserSchema);

