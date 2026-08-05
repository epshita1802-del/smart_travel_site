import api from "./api";

export const createReview = async (payload) => {
  const { data } = await api.post("/reviews", payload);
  return data.data;
};

export const getTourReviews = async (tourId) => {
  const { data } = await api.get(`/reviews/tour/${tourId}`);
  return data.data;
};

export const getAllReviews = async () => {
  const { data } = await api.get("/reviews");
  return data.data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};
