const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    currentStatus:{
        type: String,
        default:'placed',
        required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackStatus:[
        {
            status: {
                type: String,
                default: 'placed',
                trim:true
              },
            changeAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
