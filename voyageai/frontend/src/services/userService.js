import api from "./api";

export const getFavorites = async () => {
  const { data } = await api.get("/users/favorites");
  return data.data;
};

export const toggleFavorite = async (tourId) => {
  const { data } = await api.put(`/users/favorites/${tourId}`);
  return data.data;
};

export const getUsers = async (params = {}) => {
  const { data } = await api.get("/users", { params });
  return data.data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data.data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
