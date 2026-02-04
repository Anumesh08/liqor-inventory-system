import { categoryAPI } from "@/services/app";
import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: string;
  name: string;
  code?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryAPI.getPackagingConfig();
      const data = response.data;
      console.log("Category API Response:", data);

      // Check if configs exists in the response
      if (data.status && data.configs) {
        return data.configs.map((category: any) => ({
          id: category.category_id.toString(),
          name: category.category_name,
          // Add packaging sizes if needed later
          packaging_size: category.packaging_size || [],
        }));
      }
      throw new Error("Failed to fetch categories");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
