var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var ProductSchema = new Schema({
  full_name: {
    type: String,
    ref:"Review"
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

// Create model from the schema
var Product = mongoose.model("Product", ProductSchema);

// Export model
module.exports = Product;