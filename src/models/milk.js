const mongoose = require("mongoose");

const milkSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    quantityRemaining:{
        type: Number,
        required: true,
    },
    pricePerLitre:{
        type: Number,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Milk = mongoose.model("Milk", milkSchema);

module.exports = Milk;