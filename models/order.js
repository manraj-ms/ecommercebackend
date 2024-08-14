import mongoose from 'mongoose';

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      city: {
        type: String,
        required: true,
      }
    },
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        }
      }
    ],
    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Shipping", "Delivered"], 
        message: "Please select correct order status",
      },
      default: "Processing",
    },
  }
);

export default mongoose.model("Order", orderSchema);
