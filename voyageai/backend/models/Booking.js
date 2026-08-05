import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    travelDate: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    numOfTravelers: {
      type: Number,
      required: [true, "Number of travelers is required"],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    cancelReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
