import api from "./api";

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data.data;
};

export const getMyBookings = async () => {
  const { data } = await api.get("/bookings/my");
  return data.data;
};

export const cancelBooking = async (id, reason) => {
  const { data } = await api.put(`/bookings/${id}/cancel`, { reason });
  return data.data;
};

export const getAllBookings = async (params = {}) => {
  const { data } = await api.get("/bookings", { params });
  return data.data;
};

export const updateBookingStatus = async (id, payload) => {
  const { data } = await api.put(`/bookings/${id}/status`, payload);
  return data.data;
};
