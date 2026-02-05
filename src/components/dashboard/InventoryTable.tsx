"use client";

import { Search } from "@mui/icons-material";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";

interface PackagingSize {
  psid: number;
  size: string;
  size_title: string;
  category_id: number;
}

interface InventoryTableProps {
  products: any[];
  packagingSizes: PackagingSize[];
  totals: Record<string, number>;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPage: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function InventoryTable({
  products,
  packagingSizes,
  totals,
  currentPage,
  totalPages,
  totalProducts,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
  searchQuery = "",
  onSearchChange = () => {},
}: InventoryTableProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 10) return "bg-orange-100 text-orange-800";
    if (stock < 50) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div
        className="px-6 py-4 border-b border-gray-200 bg-white"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or alias..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ mr: 2, color: "text.secondary" }}
              >
                Show:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="text-black"
                  sx={{
                    fontSize: "0.875rem",
                    color: "black",
                    "& .MuiSelect-select": {
                      py: 0.5,
                    },
                  }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <div className="text-sm text-gray-500">
              Total: <span className="font-semibold">{totalProducts}</span>{" "}
              products • Page:{" "}
              <span className="font-semibold">
                {currentPage}/{totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Box
        sx={{
          maxHeight: "65vh",
          overflowY: "auto",
          overflowX: "auto",
        }}
        className="overflow-x-auto"
      >
        <table className="w-full">
          <thead
            className="bg-gray-50"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              {packagingSizes.map((size) => (
                <th
                  key={size.psid}
                  className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider"
                >
                  {size.size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={packagingSizes.length + 1}
                  className="px-6 py-12 text-center"
                >
                  <div className="text-gray-500">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm mt-1">
                      {currentPage > 1
                        ? "No more products on this page"
                        : "Try selecting a different shop or category or date."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {products.map((product) => (
                  <tr
                    key={`${product.stock_id}-${product.product_id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Name Column */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {product.product_name}
                      </div>
                      {product.alias1 && (
                        <div className="text-sm text-gray-500">
                          {product.alias1}
                        </div>
                      )}
                    </td>

                    {/* Size Columns */}
                    {packagingSizes.map((size) => (
                      <td key={size.psid} className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(
                            product[size.psid] || 0,
                          )}`}
                        >
                          {(product[size.psid] || 0).toLocaleString()} units
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Totals Row */}
                {packagingSizes.length > 0 && (
                  <tr className="bg-blue-50 font-semibold">
                    <td className="text-md px-6 py-4 text-blue-900">TOTAL</td>
                    {packagingSizes.map((size) => (
                      <td
                        key={size.psid}
                        className="px-6 py-4 text-md text-blue-900"
                      >
                        {(totals[size.psid] || 0).toLocaleString()} units
                      </td>
                    ))}
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Page Info */}
            <div className="text-sm text-gray-700">
              Showing page <span className="font-semibold">{currentPage}</span>{" "}
              of <span className="font-semibold">{totalPages}</span> •{" "}
              <span className="font-semibold">{products.length}</span> products
              on this page
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className="w-10 h-10 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>

            {/* Page Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Math.max(
                    1,
                    Math.min(totalPages, Number(e.target.value) || 1),
                  );
                  onPageChange(page);
                }}
                className="w-16 px-2 py-1 border rounded text-center text-sm text-black"
              />
              <span className="text-sm text-gray-600">/ {totalPages}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
