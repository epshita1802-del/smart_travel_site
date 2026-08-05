import api from "./api";

export const getTours = async (params = {}) => {
  const { data } = await api.get("/tours", { params });
  return data;
};

export const getTourBySlug = async (slug) => {
  const { data } = await api.get(`/tours/${slug}`);
  return data.data;
};

export const createTour = async (formData) => {
  const { data } = await api.post("/tours", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateTour = async (id, formData) => {
  const { data } = await api.put(`/tours/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const deleteTour = async (id) => {
  const { data } = await api.delete(`/tours/${id}`);
  return data;
};
