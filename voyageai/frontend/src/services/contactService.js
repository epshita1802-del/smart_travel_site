import api from "./api";

export const submitContactMessage = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data.data;
};

export const getContactMessages = async (params = {}) => {
  const { data } = await api.get("/contact", { params });
  return data.data;
};

export const updateContactMessageStatus = async (id, status) => {
  const { data } = await api.put(`/contact/${id}`, { status });
  return data.data;
};

export const deleteContactMessage = async (id) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};