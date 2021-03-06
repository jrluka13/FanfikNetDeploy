const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  raiting:{type: Array},
  comments:{type: Array},
  urlImg:{type:String},
  title: { type: String, required: true },
  genre: { type: String, required: true },
  tags: { type: Array, required: true },
  shortDecr: { type: String, required: true },
  chapters: { type: Array, required: true },
  owner: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Book", schema);
