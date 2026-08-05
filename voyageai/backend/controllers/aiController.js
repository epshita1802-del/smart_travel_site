import OpenAI from "openai";
import asyncHandler from "../middleware/asyncHandler.js";

const getClient = () => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error(
      "AI features are not configured. Please set GROQ_API_KEY in the backend .env file."
    );
    error.statusCode = 503;
    throw error;
  }
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

const extractJson = (text) => {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI response could not be parsed as JSON");
  }
};

const runJsonPrompt = async (systemPrompt, userPrompt) => {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  const text = completion.choices[0].message.content;
  return extractJson(text);
};

// @desc    AI destination recommendation
// @route   POST /api/ai/destination-recommendation
// @access  Private
export const destinationRecommendation = asyncHandler(async (req, res) => {
  const { interests, travelStyle, budgetLevel, season, tripLengthDays } = req.body;

  if (!interests) {
    res.status(400);
    throw new Error("Please describe your interests");
  }

  const system =
    "You are VoyageAI, an expert travel consultant. Always respond with strictly valid JSON only, no markdown, no commentary.";

  const user = `Recommend exactly 5 travel destinations based on:
- Interests: ${interests}
- Travel style: ${travelStyle || "not specified"}
- Budget level: ${budgetLevel || "not specified"}
- Preferred season: ${season || "not specified"}
- Trip length: ${tripLengthDays || "not specified"} days

Respond with JSON in this exact shape:
{
  "recommendations": [
    {
      "destination": "string",
      "country": "string",
      "matchScore": number (0-100),
      "reason": "string, 2-3 sentences",
      "bestTimeToVisit": "string",
      "estimatedBudgetUSD": number
    }
  ]
}`;

  const data = await runJsonPrompt(system, user);
  res.json({ success: true, data });
});

// @desc    AI budget recommendation
// @route   POST /api/ai/budget-recommendation
// @access  Private
export const budgetRecommendation = asyncHandler(async (req, res) => {
  const { destination, tripLengthDays, travelers, comfortLevel } = req.body;

  if (!destination || !tripLengthDays) {
    res.status(400);
    throw new Error("Please provide a destination and trip length");
  }

  const system =
    "You are VoyageAI, an expert travel budgeting assistant. Always respond with strictly valid JSON only, no markdown, no commentary.";

  const user = `Create a detailed budget estimate in USD for:
- Destination: ${destination}
- Trip length: ${tripLengthDays} days
- Number of travelers: ${travelers || 1}
- Comfort level: ${comfortLevel || "mid-range"}

Respond with JSON in this exact shape:
{
  "totalEstimate": number,
  "perPerson": number,
  "breakdown": {
    "accommodation": number,
    "food": number,
    "transportation": number,
    "activities": number,
    "miscellaneous": number
  },
  "moneySavingTips": ["string", "string", "string"]
}`;

  const data = await runJsonPrompt(system, user);
  res.json({ success: true, data });
});

// @desc    AI day-wise itinerary generator
// @route   POST /api/ai/itinerary
// @access  Private
export const generateItinerary = asyncHandler(async (req, res) => {
  const { destination, tripLengthDays, interests, pace } = req.body;

  if (!destination || !tripLengthDays) {
    res.status(400);
    throw new Error("Please provide a destination and trip length");
  }

  const system =
    "You are VoyageAI, an expert local trip planner. Always respond with strictly valid JSON only, no markdown, no commentary.";

  const user = `Create a day-wise travel itinerary for:
- Destination: ${destination}
- Trip length: ${tripLengthDays} days
- Interests: ${interests || "general sightseeing"}
- Pace: ${pace || "moderate"}

Respond with JSON in this exact shape:
{
  "destination": "string",
  "days": [
    {
      "day": number,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string"
    }
  ]
}`;

  const data = await runJsonPrompt(system, user);
  res.json({ success: true, data });
});

// @desc    AI packing checklist generator
// @route   POST /api/ai/packing-checklist
// @access  Private
export const generatePackingChecklist = asyncHandler(async (req, res) => {
  const { destination, season, tripLengthDays, activities } = req.body;

  if (!destination) {
    res.status(400);
    throw new Error("Please provide a destination");
  }

  const system =
    "You are VoyageAI, an expert travel packing assistant. Always respond with strictly valid JSON only, no markdown, no commentary.";

  const user = `Create a packing checklist for:
- Destination: ${destination}
- Season: ${season || "not specified"}
- Trip length: ${tripLengthDays || "not specified"} days
- Planned activities: ${activities || "general travel"}

Respond with JSON in this exact shape:
{
  "categories": [
    {
      "category": "string (e.g. Clothing, Documents, Electronics, Health & Toiletries, Gear)",
      "items": ["string", "string"]
    }
  ]
}`;

  const data = await runJsonPrompt(system, user);
  res.json({ success: true, data });
});

// @desc    AI travel tips generator
// @route   POST /api/ai/travel-tips
// @access  Private
export const generateTravelTips = asyncHandler(async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    res.status(400);
    throw new Error("Please provide a destination");
  }

  const system =
    "You are VoyageAI, an expert local travel guide. Always respond with strictly valid JSON only, no markdown, no commentary.";

  const user = `Provide practical travel tips for visiting: ${destination}

Respond with JSON in this exact shape:
{
  "destination": "string",
  "tips": [
    { "category": "string (e.g. Culture, Safety, Money, Transport, Language)", "tip": "string" }
  ]
}`;

  const data = await runJsonPrompt(system, user);
  res.json({ success: true, data });
});

// @desc    AI nearby attractions generator
// @route   POST /api/ai/nearby-attractions
// @access  Private
export const generateNearbyAttractions = asyncHandler(async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    res.status(400);
    throw new Error("Please provide a destination");
  }

  const system =
    "You are VoyageAI, a knowledgeable local guide. Always respond with strictly valid JSON only, no markdown, no commentary.";

  const user = `List notable nearby attractions around: ${destination}

Respond with JSON in this exact shape:
{
  "attractions": [
    {
      "name": "string",
      "type": "string (e.g. landmark, nature, museum, beach)",
      "distanceFromCenter": "string",
      "description": "string, 1-2 sentences"
    }
  ]
}`;

  const data = await runJsonPrompt(system, user);
  res.json({ success: true, data });
});