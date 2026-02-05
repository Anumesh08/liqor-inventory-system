"use client";

import { useMemo, useState } from "react";
import { useShops } from "@/app/hooks/useShop";
import { useCategories } from "@/app/hooks/useCategory";
import { useClosingStock } from "@/app/hooks/useStock";
import { useAuth } from "@/app/hooks/useAuth";
import ShopFilter from "@/components/dashboard/ShopFilter";
import InventoryTable from "@/components/dashboard/InventoryTable";
import { getTodayDate } from "@/services/app";
import CategoryFilter from "./CategoryFilter";
import DateFilter from "./DateFilter";
import { Box, Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { exportToExcel } from "../utils/exportToExcel";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [selectedShop, setSelectedShop] = useState<string>("6");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Fetch shops using React Query
  const {
    data: shops = [],
    isLoading: shopsLoading,
    isError: shopsError,
  } = useShops();

  // Fetch categories using React Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  // Fetch stock data using React Query - pass categories
  const {
    data: stockData,
    isLoading: stockLoading,
    isError: stockError,
  } = useClosingStock(selectedShop, selectedCategory, selectedDate, categories);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!stockData?.products) return [];

    if (!searchQuery.trim()) return stockData.products;

    const query = searchQuery.toLowerCase().trim();

    return stockData.products.filter((product: any) => {
      // Search in product_name
      if (product.product_name?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in alias1, alias2, alias3
      if (product.alias1?.toLowerCase().includes(query)) {
        return true;
      }

      if (product.alias2?.toLowerCase().includes(query)) {
        return true;
      }

      if (product.alias3?.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [stockData?.products, searchQuery]);

  // Calculate paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts.length, itemsPerPage]);

  const handleShopChange = (shopId: string) => {
    setSelectedShop(shopId);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  const calculateSummary = () => {
    const products = filteredProducts;
    const totalProducts = products.length;

    // Calculate total stock from all size columns
    let totalStock = 0;
    products.forEach((product: any) => {
      stockData?.packagingSizes?.forEach((size: any) => {
        totalStock += product[size.psid] || 0;
      });
    });

    const lowStockItems = products.filter((product: any) => {
      let isLowStock = false;
      stockData?.packagingSizes?.forEach((size: any) => {
        if ((product[size.psid] || 0) < 10) {
          isLowStock = true;
        }
      });
      return isLowStock;
    }).length;

    const selectedShopName =
      selectedShop === "6"
        ? "ALL SHOPS"
        : shops.find((s: any) => s.id.toString() === selectedShop)?.name || "";

    const selectedCategoryName =
      categories.find((c: any) => c.id === selectedCategory)?.name ||
      "All Categories";

    return {
      totalProducts,
      totalStock,
      lowStockItems,
      selectedShopName,
      selectedCategoryName,
    };
  };

  const calculateFilteredTotals = () => {
    const filteredTotals: Record<string, number> = {};

    filteredProducts.forEach((product: any) => {
      stockData?.packagingSizes?.forEach((size: any) => {
        if (!filteredTotals[size.psid]) {
          filteredTotals[size.psid] = 0;
        }
        filteredTotals[size.psid] += product[size.psid] || 0;
      });
    });

    return filteredTotals;
  };

  const handleExportToExcel = () => {
    if (!filteredProducts.length || !stockData?.packagingSizes) {
      alert("No data to export!");
      return;
    }

    setIsExporting(true);

    try {
      const selectedShopName =
        selectedShop === "6"
          ? "ALL SHOPS"
          : shops.find((s: any) => s.id.toString() === selectedShop)?.name ||
            "Unknown Shop";

      const selectedCategoryName =
        categories.find((c: any) => c.id === selectedCategory)?.name ||
        "All Categories";

      const success = exportToExcel({
        products: filteredProducts,
        packagingSizes: stockData.packagingSizes,
        shopName: selectedShopName,
        categoryName: selectedCategoryName,
        date: selectedDate,
        totals: filteredTotals,
      });

      if (success) {
        console.log("Export successful!");
      } else {
        alert("Failed to export data. Please try again.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const filteredTotals = calculateFilteredTotals();

  const summary = calculateSummary();
  const isLoading = shopsLoading || categoriesLoading || stockLoading;
  const hasError = shopsError || categoriesError || stockError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
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
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <p className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="text-base font-semibold">
                    {user.employee_name}
                  </span>
                </p>
              )}
              <button
                onClick={logout}
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
        {hasError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <div>
                <p className="font-medium text-yellow-800">
                  Could not connect to API. Please check your connection.
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  Backend API: {process.env.NEXT_PUBLIC_API_URL}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            backgroundColor: "#f9fafb",
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <ShopFilter
                shops={shops}
                selectedShop={selectedShop}
                onShopChange={handleShopChange}
              />

              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />

              <DateFilter
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            </Box>

            {/* Export Button */}
            <Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<Download />}
                onClick={handleExportToExcel}
                disabled={isExporting || filteredProducts.length === 0}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {isExporting ? "Exporting..." : "Export to Excel"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Inventory Table */}
        <InventoryTable
          products={paginatedProducts}
          packagingSizes={stockData?.packagingSizes || []}
          totals={filteredTotals}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={filteredProducts.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPage={itemsPerPage}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Liquor Inventory System. All rights reserved.</p>
          <p className="mt-1">
            Showing data for {summary.selectedShopName} •{" "}
            {summary.selectedCategoryName} • Date: {selectedDate}
          </p>
          <p className="mt-1">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
            {searchQuery && (
              <span className="text-blue-600">
                {" "}
                • Searching for: "{searchQuery}"
              </span>
            )}
          </p>
          <p className="mt-1 text-xs">
            Page {currentPage} of {totalPages} • {itemsPerPage} items per page
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
