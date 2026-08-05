import mongoose from "mongoose";
import slugify from "slugify";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    continent: {
      type: String,
      required: [true, "Continent is required"],
      enum: [
        "Asia",
        "Europe",
        "Africa",
        "North America",
        "South America",
        "Australia",
        "Antarctica",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    coverImage: {
      type: String,
      default: "",
    },
    images: [{ type: String }],
    bestTimeToVisit: {
      type: String,
      default: "",
    },
    averageBudget: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
    popularAttractions: [{ type: String }],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

destinationSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(`${this.name}-${this.country}`, { lower: true, strict: true });
  }
  next();
});

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
