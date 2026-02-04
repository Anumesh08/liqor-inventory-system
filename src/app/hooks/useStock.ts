// import { getTodayDate, stockAPI } from "@/services/app";
// import { useQuery } from "@tanstack/react-query";

// export const useClosingStock = (
//   shopId: string,
//   categoryId: string = "1",
//   date: string = getTodayDate(),
//   categories: any[] = [],
// ) => {
//   return useQuery({
//     queryKey: ["closing-stock", shopId, categoryId, date],
//     queryFn: async () => {
//       if (!shopId || shopId === "") {
//         return { products: [], pagination: { total: 0, totalPages: 1 } };
//       }

//       const response = await stockAPI.getClosingStock(shopId, categoryId, date);
//       const data = response.data;

//       if (data.status && data.data?.closing_stocks) {
//         const products = data.data.closing_stocks.map((stock: any) => ({
//           stock_id: stock.stock_id,
//           product_id: stock.product_id,
//           product_name: stock.product_name,
//           psid: stock.psid,
//           size: stock.size,
//           size_title: stock.size_title,
//           stock_qty: stock.stock_qty,
//         }));

//         return {
//           products,
//           pagination: data.pagination || {
//             total: products.length,
//             totalPages: 1,
//           },
//         };
//       }
//       throw new Error("Failed to fetch stock data");
//     },
//     enabled: !!shopId && shopId !== "",
//     staleTime: 2 * 60 * 1000, // 2 minutes
//     retry: 1,
//   });
// };

import { getTodayDate, stockAPI } from "@/services/app";
import { useQuery } from "@tanstack/react-query";

export const useClosingStock = (
  shopId: string,
  categoryId: string = "1",
  date: string = getTodayDate(),
  categories: any[] = [], // Add categories to get packaging sizes
) => {
  return useQuery({
    queryKey: ["closing-stock", shopId, categoryId, date],
    queryFn: async () => {
      if (!shopId || shopId === "") {
        return {
          products: [],
          packagingSizes: [],
          pagination: { total: 0, totalPages: 1 },
        };
      }

      const response = await stockAPI.getClosingStock(shopId, categoryId, date);
      const data = response.data;

      // Find the selected category to get packaging sizes
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      const packagingSizes = selectedCategory?.packaging_size || [];

      if (data.status && data.data?.closing_stocks) {
        const products = data.data.closing_stocks.map((stock: any) => {
          // Create product object with dynamic size columns
          const product: any = {
            stock_id: stock.stock_id,
            product_id: stock.product_id,
            product_name: stock.product_name,
            alias1: stock.alias1,
            alias2: stock.alias2,
            alias3: stock.alias3,
          };

          // Add each size column based on packaging sizes
          packagingSizes.forEach((size: any) => {
            // Use psid as key (22, 23, 24, etc.)
            product[size.psid] = stock[size.psid] || 0;
          });

          return product;
        });

        return {
          products,
          packagingSizes, // Include packaging sizes for table headers
          totals: data.data.totals || {},
          pagination: { total: products.length, totalPages: 1 },
        };
      }
      throw new Error("Failed to fetch stock data");
    },
    enabled: !!shopId && shopId !== "" && categories.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};
