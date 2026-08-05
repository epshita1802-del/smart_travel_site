import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tour title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: [true, "Tour must belong to a destination"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    summary: {
      type: String,
      maxlength: 250,
      required: [true, "Summary is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    images: [{ type: String }],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "Duration (in days) is required"],
      min: 1,
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Max group size is required"],
      default: 10,
    },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "challenging"],
      default: "easy",
    },
    category: {
      type: String,
      enum: [
        "adventure",
        "beach",
        "cultural",
        "wildlife",
        "mountain",
        "city",
        "cruise",
        "honeymoon",
        "family",
      ],
      required: [true, "Category is required"],
    },
    startDates: [{ type: Date }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

tourSchema.index({ title: "text", summary: "text", description: "text" });

tourSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true, strict: true });
  }
  next();
});

tourSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

tourSchema.set("toJSON", { virtuals: true });
tourSchema.set("toObject", { virtuals: true });

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
