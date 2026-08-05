import asyncHandler from "../middleware/asyncHandler.js";
import Destination from "../models/Destination.js";
import Tour from "../models/Tour.js";

// @desc    Get all destinations (with filters)
// @route   GET /api/destinations
// @access  Public
export const getDestinations = asyncHandler(async (req, res) => {
  const { search, continent, featured, sort, page = 1, limit = 12 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }

  if (continent) query.continent = continent;
  if (featured === "true") query.isFeatured = true;

  let sortOption = "-createdAt";
  if (sort === "rating") sortOption = "-rating";
  if (sort === "budget-asc") sortOption = "averageBudget";
  if (sort === "budget-desc") sortOption = "-averageBudget";

  const skip = (Number(page) - 1) * Number(limit);

  const [destinations, total] = await Promise.all([
    Destination.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
    Destination.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: destinations.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: destinations,
  });
});

// @desc    Get single destination by slug + its tours
// @route   GET /api/destinations/:slug
// @access  Public
export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({ slug: req.params.slug });

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const tours = await Tour.find({ destination: destination._id, isActive: true });

  res.json({ success: true, data: { destination, tours } });
});

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };

  if (req.file) {
    payload.coverImage = `/uploads/${req.file.filename}`;
  }

  if (typeof payload.tags === "string") {
    payload.tags = payload.tags.split(",").map((t) => t.trim());
  }
  if (typeof payload.popularAttractions === "string") {
    payload.popularAttractions = payload.popularAttractions.split(",").map((t) => t.trim());
  }

  const destination = await Destination.create(payload);
  res.status(201).json({ success: true, data: destination });
});

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const updates = { ...req.body };

  if (req.file) {
    updates.coverImage = `/uploads/${req.file.filename}`;
  }
  if (typeof updates.tags === "string") {
    updates.tags = updates.tags.split(",").map((t) => t.trim());
  }
  if (typeof updates.popularAttractions === "string") {
    updates.popularAttractions = updates.popularAttractions.split(",").map((t) => t.trim());
  }

  Object.assign(destination, updates);
  const updated = await destination.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const tourCount = await Tour.countDocuments({ destination: destination._id });
  if (tourCount > 0) {
    res.status(400);
    throw new Error("Cannot delete a destination with existing tours. Remove its tours first.");
  }

  await destination.deleteOne();
  res.json({ success: true, message: "Destination removed" });
});
