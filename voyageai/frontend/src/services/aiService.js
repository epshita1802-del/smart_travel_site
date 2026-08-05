import api from "./api";

export const getDestinationRecommendation = async (payload) => {
  const { data } = await api.post("/ai/destination-recommendation", payload);
  return data.data;
};

export const getBudgetRecommendation = async (payload) => {
  const { data } = await api.post("/ai/budget-recommendation", payload);
  return data.data;
};

export const getItinerary = async (payload) => {
  const { data } = await api.post("/ai/itinerary", payload);
  return data.data;
};

export const getPackingChecklist = async (payload) => {
  const { data } = await api.post("/ai/packing-checklist", payload);
  return data.data;
};

export const getTravelTips = async (payload) => {
  const { data } = await api.post("/ai/travel-tips", payload);
  return data.data;
};

export const getNearbyAttractions = async (payload) => {
  const { data } = await api.post("/ai/nearby-attractions", payload);
  return data.data;
};
