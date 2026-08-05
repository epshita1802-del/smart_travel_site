import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Destination from "../models/Destination.js";
import Tour from "../models/Tour.js";

dotenv.config();
await connectDB();

const run = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    let admin = adminExists;

    if (!adminExists) {
      admin = await User.create({
        name: "VoyageAI Admin",
        email: process.env.ADMIN_EMAIL || "admin@voyageai.com",
        password: process.env.ADMIN_PASSWORD || "Admin@12345",
        role: "admin",
      });
      console.log("Admin user created:", admin.email);
    } else {
      console.log("Admin user already exists:", admin.email);
    }

    const destinationCount = await Destination.countDocuments();
    if (destinationCount === 0) {
      const destinations = await Destination.insertMany([
        {
          name: "Bali",
          country: "Indonesia",
          continent: "Asia",
          description:
            "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. It offers a rich culture, world-class surf spots, and vibrant nightlife.",
          shortDescription: "Tropical island paradise with beaches, temples and rice terraces.",
          coverImage: "/uploads/seed/bali.jpg",
          bestTimeToVisit: "April to October",
          averageBudget: 1200,
          tags: ["beach", "culture", "honeymoon"],
          popularAttractions: ["Uluwatu Temple", "Tegallalang Rice Terrace", "Seminyak Beach"],
          rating: 4.8,
          numReviews: 152,
          isFeatured: true,
          createdBy: admin._id,
        },
        {
          name: "Swiss Alps",
          country: "Switzerland",
          continent: "Europe",
          description:
            "The Swiss Alps offer dramatic mountain scenery, pristine lakes, and charming alpine villages, making them a premier destination for hiking, skiing, and scenic train journeys.",
          shortDescription: "Majestic mountain ranges, skiing and alpine villages.",
          coverImage: "/uploads/seed/swiss-alps.jpg",
          bestTimeToVisit: "December to March, June to September",
          averageBudget: 2500,
          tags: ["mountain", "adventure"],
          popularAttractions: ["Matterhorn", "Jungfraujoch", "Lake Lucerne"],
          rating: 4.9,
          numReviews: 98,
          isFeatured: true,
          createdBy: admin._id,
        },
        {
          name: "Kyoto",
          country: "Japan",
          continent: "Asia",
          description:
            "Kyoto, once the capital of Japan, is a city on the island of Honshu famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
          shortDescription: "Ancient temples, traditional tea houses and cherry blossoms.",
          coverImage: "/uploads/seed/kyoto.jpg",
          bestTimeToVisit: "March to May, October to November",
          averageBudget: 1800,
          tags: ["culture", "city"],
          popularAttractions: ["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Kinkaku-ji"],
          rating: 4.7,
          numReviews: 210,
          isFeatured: true,
          createdBy: admin._id,
        },
        {
          name: "Santorini",
          country: "Greece",
          continent: "Europe",
          description:
            "Santorini is one of the Cyclades islands in the Aegean Sea, known for its whitewashed, cubiform houses, dramatic caldera views, and stunning sunsets over the sea.",
          shortDescription: "Iconic white-washed cliffside villages and sunsets.",
          coverImage: "/uploads/seed/santorini.jpg",
          bestTimeToVisit: "May to September",
          averageBudget: 2000,
          tags: ["beach", "honeymoon"],
          popularAttractions: ["Oia Sunset", "Red Beach", "Fira Town"],
          rating: 4.9,
          numReviews: 175,
          isFeatured: true,
          createdBy: admin._id,
        },
      ]);
      console.log(`${destinations.length} destinations seeded`);

      const tours = await Tour.insertMany([
        {
          title: "Bali Beach & Culture Escape",
          destination: destinations[0]._id,
          description:
            "A 6-day journey through Bali's most iconic beaches, ancient temples, and lush rice terraces, complete with a private guide and boutique accommodation.",
          summary: "Beaches, temples and rice terraces on a guided 6-day escape.",
          coverImage: "/uploads/seed/bali-tour.jpg",
          price: 1299,
          discountPrice: 1099,
          duration: 6,
          maxGroupSize: 12,
          difficulty: "easy",
          category: "beach",
          startDates: [new Date("2026-09-10"), new Date("2026-10-05")],
          itinerary: [
            { day: 1, title: "Arrival in Denpasar", description: "Airport pickup and check-in at beachfront resort in Seminyak." },
            { day: 2, title: "Uluwatu Temple & Surf", description: "Visit the cliffside Uluwatu Temple and watch a traditional Kecak fire dance." },
            { day: 3, title: "Ubud Rice Terraces", description: "Explore Tegallalang rice terraces and the Ubud Monkey Forest." },
            { day: 4, title: "Mount Batur Sunrise Trek", description: "Early morning volcano trek followed by a hot spring soak." },
            { day: 5, title: "Nusa Penida Island Tour", description: "Boat trip to Nusa Penida to see Kelingking Beach and Angel's Billabong." },
            { day: 6, title: "Departure", description: "Free morning for shopping, then airport transfer." },
          ],
          inclusions: ["5 nights accommodation", "Daily breakfast", "Private guide", "Airport transfers"],
          exclusions: ["International flights", "Travel insurance", "Personal expenses"],
          rating: 4.8,
          numReviews: 64,
          isFeatured: true,
          createdBy: admin._id,
        },
        {
          title: "Swiss Alps Adventure Trek",
          destination: destinations[1]._id,
          description:
            "An 8-day alpine adventure featuring scenic train rides, guided hiking trails, and overnight stays in charming mountain villages across the Swiss Alps.",
          summary: "Scenic trains and guided hikes through the Swiss Alps.",
          coverImage: "/uploads/seed/swiss-tour.jpg",
          price: 2899,
          discountPrice: 0,
          duration: 8,
          maxGroupSize: 10,
          difficulty: "challenging",
          category: "mountain",
          startDates: [new Date("2026-07-15"), new Date("2026-08-20")],
          itinerary: [
            { day: 1, title: "Arrival in Zurich", description: "Transfer to Lucerne and evening lake cruise." },
            { day: 2, title: "Mount Pilatus", description: "Cable car ascent and panoramic ridge walk." },
            { day: 3, title: "Interlaken", description: "Travel to Interlaken via scenic rail route." },
            { day: 4, title: "Jungfraujoch", description: "Full day trip to the 'Top of Europe'." },
            { day: 5, title: "Zermatt Hiking", description: "Guided trek with views of the Matterhorn." },
            { day: 6, title: "Gornergrat Railway", description: "Sunrise train ride to Gornergrat viewpoint." },
            { day: 7, title: "Free Alpine Day", description: "Optional paragliding or spa relaxation." },
            { day: 8, title: "Departure", description: "Return transfer to Zurich airport." },
          ],
          inclusions: ["7 nights accommodation", "Daily breakfast & dinner", "All train passes", "Certified mountain guide"],
          exclusions: ["International flights", "Lunches", "Travel insurance"],
          rating: 4.9,
          numReviews: 41,
          isFeatured: true,
          createdBy: admin._id,
        },
        {
          title: "Kyoto Heritage & Zen Gardens",
          destination: destinations[2]._id,
          description:
            "A 5-day cultural immersion in Kyoto, visiting ancient temples, Zen gardens, and taking part in a traditional tea ceremony.",
          summary: "Temples, Zen gardens and tea ceremonies in historic Kyoto.",
          coverImage: "/uploads/seed/kyoto-tour.jpg",
          price: 1599,
          discountPrice: 1399,
          duration: 5,
          maxGroupSize: 14,
          difficulty: "easy",
          category: "cultural",
          startDates: [new Date("2026-04-01"), new Date("2026-11-10")],
          itinerary: [
            { day: 1, title: "Arrival in Kyoto", description: "Check-in and evening walk through Gion district." },
            { day: 2, title: "Fushimi Inari & Tea Ceremony", description: "Morning shrine hike, afternoon traditional tea ceremony." },
            { day: 3, title: "Arashiyama Bamboo Grove", description: "Visit the bamboo forest and Tenryu-ji temple gardens." },
            { day: 4, title: "Kinkaku-ji & Nijo Castle", description: "Golden Pavilion tour and castle grounds exploration." },
            { day: 5, title: "Departure", description: "Free morning, then transfer to Kansai airport." },
          ],
          inclusions: ["4 nights accommodation", "Daily breakfast", "Tea ceremony experience", "English-speaking guide"],
          exclusions: ["International flights", "Some lunches/dinners", "Travel insurance"],
          rating: 4.7,
          numReviews: 88,
          isFeatured: true,
          createdBy: admin._id,
        },
        {
          title: "Santorini Sunset Romance",
          destination: destinations[3]._id,
          description:
            "A 4-day romantic getaway through Santorini's caldera villages, complete with a private catamaran cruise and candlelit dinner overlooking the sea.",
          summary: "A romantic escape with caldera views and catamaran cruising.",
          coverImage: "/uploads/seed/santorini-tour.jpg",
          price: 1799,
          discountPrice: 0,
          duration: 4,
          maxGroupSize: 8,
          difficulty: "easy",
          category: "honeymoon",
          startDates: [new Date("2026-06-05"), new Date("2026-09-15")],
          itinerary: [
            { day: 1, title: "Arrival in Santorini", description: "Check-in at caldera-view suite in Oia." },
            { day: 2, title: "Fira to Oia Hike", description: "Scenic coastal hike with stops at local wineries." },
            { day: 3, title: "Catamaran Cruise", description: "Private sunset cruise with onboard dinner." },
            { day: 4, title: "Departure", description: "Free morning to explore Oia's boutiques before transfer." },
          ],
          inclusions: ["3 nights accommodation", "Daily breakfast", "Private catamaran cruise", "Airport transfers"],
          exclusions: ["International flights", "Lunches", "Travel insurance"],
          rating: 4.9,
          numReviews: 57,
          isFeatured: true,
          createdBy: admin._id,
        },
      ]);
      console.log(`${tours.length} tours seeded`);
    } else {
      console.log("Destinations already seeded, skipping.");
    }

    console.log("Seeding complete.");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

run();
