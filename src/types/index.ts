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

export interface Product {
  stock_id: number;
  product_id: number;
  product_name: string;
  psid?: number;
  size: string;
  size_title: string;
  stock_qty: string;
}
