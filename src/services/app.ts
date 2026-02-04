import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API functions
export const shopAPI = {
  getAllShops: () => api.get("/Shop/all_shops"),
};

export const categoryAPI = {
  getPackagingConfig: () => api.get("/ProductCategory/packaging_config"),
};

export const stockAPI = {
  getClosingStock: (shop_id: string, category_id: string = "1", date: string) =>
    api.get("/Stock/closing_stock", {
      params: { shop_id, category_id, date },
    }),
};

// Helper function to get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
