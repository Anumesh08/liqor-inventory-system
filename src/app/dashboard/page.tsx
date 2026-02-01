"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Product, Shop, User } from "@/types";
import SummaryCard from "@/components/dashboard/SummaryCard";
import ShopFilter from "@/components/dashboard/ShopFilter";
import InventoryTable from "@/components/dashboard/InventoryTable";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const router = useRouter();
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    fetchShops();
  }, [router]);

  useEffect(() => {
    // Fetch stock data when shop, page, or items per page changes
    if (selectedShop && shops.length > 0) {
      fetchStockData();
    }
  }, [selectedShop, currentPage, itemsPerPage]);

  // Fetch shops from API
  const fetchShops = async () => {
    try {
      const token = localStorage.getItem("token");

      const shopsResponse = await axios.get(`${API_BASE_URL}/Shop/all_shops`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = shopsResponse.data;
      console.log("Shops API Response:", data);

      if (data.status && data.shops) {
        const transformedShops = data.shops.map((shop: any) => ({
          id: shop.shop_id,
          name: shop.shop_name,
          code: shop.license_no,
          address: shop.address,
          contact_no: shop.contact_no,
          isActive: true,
        }));

        setShops(transformedShops);

        // Set default to "ALL SHOPS" (shop_id=6)
        setSelectedShop("6");
        setLoading(false);
      } else {
        throw new Error("Failed to fetch shops");
      }
    } catch (error: any) {
      console.error("Shops API Error:", error);
      setApiError("Could not connect to shops API. Showing demo data.");

      // Fallback to mock shops
      const mockShops = [
        {
          id: 6,
          name: "ALL SHOPS",
          code: "LICNO87686",
          address: "Datta Mandir, Nashik - 422001",
          contact_no: "88888777799",
          isActive: true,
        },
        {
          id: 5,
          name: "Govinda Wines",
          code: "LIC898097",
          address: "Old Agra Rd, Mumbai Naka, Renuka Nagar, Nashik",
          contact_no: "7897890077",
          isActive: true,
        },
        {
          id: 4,
          name: "Kitkat Wine Shop",
          address:
            "Trambakeshwar Rd, Opp. Zilla Parishad, Trimbak Naka, Shalimar, Nashik, Maharashtra 422001",
          contact_no: "8748745522",
          code: "LICuew98re",
          isActive: true,
        },
        {
          id: 1,
          name: "Patel Wines",
          code: "IL324jsdkfj",
          address: "Datta Mandir Signal, Nashik Road, Nashik - 422101",
          contact_no: "9090898977",
          isActive: true,
        },
        {
          id: 3,
          name: "Rakesh Wines",
          code: "IL32oireuore",
          address:
            "1, Wadala Naka, Mayur Complex, Renuka Nagar, Nashik, Maharashtra 422001",
          contact_no: "7889966321",
          isActive: true,
        },
        {
          id: 2,
          name: "YO-YO Wines",
          code: "LICNOFL8979",
          address: "Ashok Stambh, Nashik - 422001",
          contact_no: "7878969645",
          isActive: true,
        },
      ];

      setShops(mockShops);
      setSelectedShop("6");
      setLoading(false);
    }
  };

  // Fetch stock data
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/Stock/closing_stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          shop_id: selectedShop,
          page_no: currentPage,
          limit: itemsPerPage,
        },
      });

      const data = response.data;
      console.log("Stock API Response:", data);

      if (data.status && data.data?.closing_stocks) {
        const transformedProducts = data.data.closing_stocks.map(
          (stock: any) => ({
            stock_id: stock.stock_id,
            product_id: stock.product_id,
            product_name: stock.product_name,
            psid: stock.psid,
            size: stock.size,
            size_title: stock.size_title,
            stock_qty: stock.stock_qty,
          }),
        );

        setProducts(transformedProducts);
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
        setApiError("");
      }
    } catch (error: any) {
      console.error("Stock API Error:", error);
      setApiError("Could not fetch stock data. Please try again.");
      setLoading(false);
    }
  };

  const handleShopChange = (shopId: string) => {
    setSelectedShop(shopId);
    setCurrentPage(1); // Reset to page 1 when shop changes
  };

  const calculateSummary = () => {
    const totalStock = products.reduce(
      (sum, p) => sum + (parseInt(p.stock_qty) || 0),
      0,
    );
    const lowStockItems = products.filter(
      (p) => (parseInt(p.stock_qty) || 0) < 10,
    ).length;

    const selectedShopName =
      selectedShop === "6"
        ? "ALL SHOPS"
        : shops.find((s) => s.id.toString() === selectedShop)?.name || "";

    return {
      totalProducts: totalProducts,
      totalStock,
      lowStockItems,
      selectedShopName,
    };
  };

  const summary = calculateSummary();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user.employee_name} - {user.shop?.shop_name}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">LI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Liquor Inventory System
                </h1>
                {user && (
                  <p className="text-sm text-gray-600">
                    Welcome,{" "}
                    <span className="font-semibold">{user.employee_name}</span>{" "}
                    • Shop:{" "}
                    <span className="font-semibold">
                      {user.shop?.shop_name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* API Error Warning */}
        {apiError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <div>
                <p className="font-medium text-yellow-800">{apiError}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Backend API: {API_BASE_URL}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard
            title="Current Shop"
            value={summary.selectedShopName}
            icon="🏪"
            color="blue"
          />
          <SummaryCard
            title="Total Products"
            value={summary.totalProducts.toLocaleString()}
            icon="📦"
            color="green"
          />
          <SummaryCard
            title="Total Stock"
            value={summary.totalStock.toLocaleString()}
            icon="📊"
            color="purple"
          />
          <SummaryCard
            title="Low Stock Items"
            value={summary.lowStockItems}
            icon="⚠️"
            color="orange"
          />
        </div>

        {/* Shop Filter */}
        <div className="mb-6">
          <ShopFilter
            shops={shops}
            selectedShop={selectedShop}
            onShopChange={handleShopChange}
          />
        </div>

        {/* Inventory Table */}
        <InventoryTable
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPage={itemsPerPage}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © 2024 Liquor Inventory System. Data updated on{" "}
            {new Date().toLocaleDateString()}
          </p>
          <p className="mt-1">
            Showing data for {summary.selectedShopName} • Page {currentPage} of{" "}
            {totalPages} • {products.length} products on this page
          </p>
          {user && (
            <p className="mt-1 text-xs">
              Logged in as: {user.employee_name} ({user.employee_type})
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
