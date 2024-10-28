import mongoose, { Schema } from "mongoose";

const prizeSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, required: true },
});


// Create the RaffleDraw Model
const Prizes = mongoose.model("prizes", prizeSchema);

export default Prizes;