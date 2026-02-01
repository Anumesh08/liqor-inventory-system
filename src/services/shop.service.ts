import apiClient from "@/lib/api/client";
import { Shop } from "@/types";

export const shopService = {
  getAllShops: async (): Promise<Shop[]> => {
    try {
      const response = await apiClient.get("/shops");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching shops:", error);
      throw error;
    }
  },

  getShopById: async (id: number): Promise<Shop> => {
    try {
      const response = await apiClient.get(`/shops/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching shop ${id}:`, error);
      throw error;
    }
  },
};
