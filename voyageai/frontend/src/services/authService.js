import api from "./api";

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const updateProfile = async (formData) => {
  const { data } = await api.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
