import asyncHandler from "../middleware/asyncHandler.js";
import ContactMessage from "../models/ContactMessage.js";

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const contactMessage = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ success: true, data: contactMessage });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};

  const messages = await ContactMessage.find(query).sort("-createdAt");
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc    Update a message's status (new/read/replied)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.status = req.body.status || message.status;
  await message.save();

  res.json({ success: true, data: message });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();
  res.json({ success: true, message: "Message removed" });
});