import api from "./api";

export const getDestinations = async (params = {}) => {
  const { data } = await api.get("/destinations", { params });
  return data;
};

export const getDestinationBySlug = async (slug) => {
  const { data } = await api.get(`/destinations/${slug}`);
  return data.data;
};

export const createDestination = async (formData) => {
  const { data } = await api.post("/destinations", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateDestination = async (id, formData) => {
  const { data } = await api.put(`/destinations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const deleteDestination = async (id) => {
  const { data } = await api.delete(`/destinations/${id}`);
  return data;
};
