export interface User {
  employee_id: number;
  employee_name: string;
  mobile_no: string;
  shop_id: number;
  employee_type: string;
  shop: {
    shop_id: number;
    shop_name: string;
    address: string;
    license_no: string;
    contact_no: string;
  };
}

export interface Shop {
  id: number;
  name: string;
  code: string;
  address: string;
  contact_no?: string;
  isActive: boolean;
}

export interface Category {
  id: string | number;
  name: string;
  packaging_size?: PackagingSize[]; // Add packaging_size property
}

export interface PackagingSize {
  psid: number;
  size: string;
  size_title: string;
  category_id: number;
}
export interface Product {
  stock_id: number;
  product_id: number;
  product_name: string;
  psid?: number;
  size: string;
  size_title: string;
  stock_qty: string;
}
