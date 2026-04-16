import { api } from "@/services/app";

export interface ProductListResponse {
  product_id: number;
  main_category_id: number;
  category_id: number;
  main_category: string;
  category: string;
  product_name: string;
  mrp: number;
  barcode: string | null;
  alias1: string | null;
  alias2: string | null;
  alias3: string | null;
}

export interface ProductResponse {
  status: boolean;
  message: string;
  data: ProductListResponse[];
}

export interface MainCategory {
  main_category_id: number;
  main_category: string;
}

export interface SubCategory {
  category_id: number;
  category: string;
  main_category_id: number;
}

export const getProductsAPI = async (
  page?: number,
  limit?: number,
  q?: string,
) => {
  const response = await api.get("/Product", {
    params: {
      page_no: page,
      limit: limit,
      q: q,
    },
  });
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const response = await api.delete("/Product", {
    params: {
      product_id: productId,
    },
  });

  return response.data;
};

export const getMainCategories = async () => {
  const response = await api.get("/ProductCategory/main_categories");
  return response.data;
};

export const getSubCategories = async (main_category_id: number) => {
  const response = await api.get(
    `/ProductCategory/liquor_categories?main_category_id=${main_category_id}`,
  );
  return response.data;
};

export const createProduct = async (data: any) => {
  try {
    const response = await api.post(`/Product`, { ...data });
    return response.data;
  } catch (error) {
    console.error("Error creating Product:", error);
    throw error;
  }
};

export const updateProduct = async (data: any) => {
  console.log("UPDATE DATA =", data);

  try {
    const response = await api.patch("/Product", data);

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
