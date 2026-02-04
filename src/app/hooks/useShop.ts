import { shopAPI } from "@/services/app";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useShops = () => {
  return useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const response = await shopAPI.getAllShops();
      const data = response.data;

      if (data.status && data.shops) {
        return data.shops.map((shop: any) => ({
          id: shop.shop_id,
          name: shop.shop_name,
          code: shop.license_no,
          address: shop.address,
          contact_no: shop.contact_no,
          isActive: true,
        }));
      }
      throw new Error("Failed to fetch shops");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
